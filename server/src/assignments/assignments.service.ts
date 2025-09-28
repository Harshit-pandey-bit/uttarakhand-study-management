// server/src/assignments/assignments.service.ts

import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  AssignmentDto,
  AssignmentListResponseDto,
  CreateAssignmentDto,
  AIGenerateAssignmentDto,
  SubmitAssignmentDto,
  AssignmentSubmissionDto,
  NCERTChapterDto,
  AssignmentStatsDto,
  DifficultyLevel,
  AssignmentStatus,
  AssignmentQuestionDto,
  SubmissionFormat,
} from './dto/assignments.dto';

@Injectable()
export class AssignmentsService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  // =============================================
  // STUDENT ASSIGNMENT ENDPOINTS
  // =============================================

  async getStudentAssignments(
    studentId: string,
    status?: AssignmentStatus,
    subject?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<AssignmentListResponseDto> {
    console.log('📚 Getting assignments for student:', studentId);

    try {
      // Get student's class level
      const { data: studentProfile } = await this.supabase
        .from('student_profiles')
        .select('class_level')
        .eq('user_id', studentId)
        .single();

      if (!studentProfile) {
        throw new NotFoundException('Student profile not found');
      }

      const classLevel = studentProfile.class_level;

      // Build query
      let query = this.supabase
        .from('assignments')
        .select(`
          *,
          assignment_submissions!left(
            id, submitted_at, score, feedback, grade, status
          )
        `)
        .eq('class_level', classLevel)
        .eq('is_active', true);

      if (subject) {
        query = query.eq('subject', subject);
      }

      const { data: assignments, error } = await query
        .order('due_date', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error('Failed to fetch assignments: ' + error.message);
      }

      // Process assignments and determine status
      const processedAssignments = assignments?.map(assignment => {
        const submission = assignment.assignment_submissions?.[0];
        const now = new Date();
        const dueDate = new Date(assignment.due_date);

        let status: AssignmentStatus;
        if (submission) {
          status = submission.status === 'graded' ? AssignmentStatus.GRADED : AssignmentStatus.SUBMITTED;
        } else if (now > dueDate) {
          status = AssignmentStatus.OVERDUE;
        } else {
          status = AssignmentStatus.PENDING;
        }

        return this.formatAssignmentDto(assignment, submission, status);
      }) || [];

      // Filter by status if specified
      const filteredAssignments = status
        ? processedAssignments.filter(a => a.status === status)
        : processedAssignments;

      // Calculate statistics
      const stats = this.calculateAssignmentStats(processedAssignments);

      console.log('✅ Retrieved', filteredAssignments.length, 'assignments for student');
      
      return {
        assignments: filteredAssignments,
        total: stats.total,
        pending: stats.pending,
        completed: stats.completed,
        overdue: stats.overdue
      };

    } catch (error) {
      console.log('❌ Error getting student assignments:', error.message);
      throw error;
    }
  }

  async getAssignmentById(assignmentId: string, studentId: string): Promise<AssignmentDto> {
    console.log('📖 Getting assignment details:', assignmentId);

    try {
      const { data: assignment, error } = await this.supabase
        .from('assignments')
        .select(`
          *,
          assignment_submissions!left(
            id, submitted_at, score, feedback, grade, status, submission_files, submission_text
          )
        `)
        .eq('id', assignmentId)
        .eq('is_active', true)
        .single();

      if (error || !assignment) {
        throw new NotFoundException('Assignment not found');
      }

      // Check if student can access this assignment
      const { data: studentProfile } = await this.supabase
        .from('student_profiles')
        .select('class_level')
        .eq('user_id', studentId)
        .single();

      if (assignment.class_level !== studentProfile?.class_level) {
        throw new ForbiddenException('Access denied to this assignment');
      }

      const submission = assignment.assignment_submissions?.find(
        (sub: any) => sub.student_id === studentId
      );

      const status = this.determineAssignmentStatus(assignment, submission);

      return this.formatAssignmentDto(assignment, submission, status);

    } catch (error) {
      console.log('❌ Error getting assignment details:', error.message);
      throw error;
    }
  }

  async submitAssignment(studentId: string, submitData: SubmitAssignmentDto): Promise<AssignmentSubmissionDto> {
    console.log('📤 Submitting assignment:', submitData.assignmentId);

    try {
      // Verify assignment exists and student can access it
      const assignment = await this.getAssignmentById(submitData.assignmentId, studentId);
      
      if (assignment.status === AssignmentStatus.OVERDUE) {
        throw new BadRequestException('Cannot submit assignment after due date');
      }

      // Check for existing submission
      const { data: existingSubmission } = await this.supabase
        .from('assignment_submissions')
        .select('*')
        .eq('assignment_id', submitData.assignmentId)
        .eq('student_id', studentId)
        .single();

      if (existingSubmission) {
        throw new BadRequestException('Assignment already submitted');
      }

      // Create submission
      const { data: submission, error } = await this.supabase
        .from('assignment_submissions')
        .insert({
          assignment_id: submitData.assignmentId,
          student_id: studentId,
          submission_files: submitData.submissionFiles || [],
          submission_text: submitData.submissionText,
          status: 'submitted'
        })
        .select('*')
        .single();

      if (error) {
        throw new Error('Failed to submit assignment: ' + error.message);
      }

      console.log('✅ Assignment submitted successfully');

      return {
        id: submission.id,
        assignmentId: submission.assignment_id,
        assignmentTitle: assignment.title,
        submissionFiles: submission.submission_files || [],
        submissionText: submission.submission_text,
        submittedAt: submission.submitted_at,
        status: submission.status
      };

    } catch (error) {
      console.log('❌ Error submitting assignment:', error.message);
      throw error;
    }
  }

  async getStudentSubmissions(studentId: string): Promise<AssignmentSubmissionDto[]> {
    console.log('📋 Getting submissions for student:', studentId);

    try {
      const { data: submissions, error } = await this.supabase
        .from('assignment_submissions')
        .select(`
          *,
          assignments!inner(title, subject, due_date)
        `)
        .eq('student_id', studentId)
        .order('submitted_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch submissions: ' + error.message);
      }

      const formattedSubmissions = submissions?.map(sub => ({
        id: sub.id,
        assignmentId: sub.assignment_id,
        assignmentTitle: sub.assignments.title,
        submissionFiles: sub.submission_files || [],
        submissionText: sub.submission_text,
        submittedAt: sub.submitted_at,
        score: sub.score,
        feedback: sub.feedback,
        grade: sub.grade,
        status: sub.status
      })) || [];

      console.log('✅ Retrieved', formattedSubmissions.length, 'submissions');
      return formattedSubmissions;

    } catch (error) {
      console.log('❌ Error getting submissions:', error.message);
      throw error;
    }
  }

  // =============================================
  // TEACHER ASSIGNMENT ENDPOINTS
  // =============================================

  async createAssignment(teacherId: string, createData: CreateAssignmentDto): Promise<AssignmentDto> {
    console.log('📝 Creating new assignment for teacher:', teacherId);

    try {
      const { data: assignment, error } = await this.supabase
        .from('assignments')
        .insert({
          title: createData.title,
          description: createData.description,
          subject: createData.subject,
          class_level: createData.classLevel,
          teacher_id: teacherId,
          due_date: createData.dueDate,
          difficulty: createData.difficulty,
          ncert_chapter: createData.ncertChapter,
          total_marks: createData.totalMarks,
          time_estimate: createData.timeEstimate,
          questions: createData.questions,
          submission_format: createData.submissionFormat,
          teacher_notes: createData.teacherNotes,
          ai_generated: false
        })
        .select('*')
        .single();

      if (error) {
        throw new Error('Failed to create assignment: ' + error.message);
      }

      console.log('✅ Assignment created successfully');
      return this.formatAssignmentDto(assignment, null, AssignmentStatus.PENDING);

    } catch (error) {
      console.log('❌ Error creating assignment:', error.message);
      throw error;
    }
  }

  async generateAIAssignment(teacherId: string, aiData: AIGenerateAssignmentDto): Promise<AssignmentDto> {
    console.log('🤖 Generating AI assignment for teacher:', teacherId);

    try {
      // Get NCERT chapter details for context
      const chapterContext = await this.getChapterContext(aiData.subject, aiData.classLevel, aiData.ncertChapter);

      // Generate questions using AI
      const generatedQuestions = await this.generateQuestionsWithAI(aiData, chapterContext);

      // Create assignment with AI-generated content
      const assignmentData: CreateAssignmentDto = {
        title: `${aiData.ncertChapter} - Practice Assignment`,
        description: `AI-generated practice questions for ${aiData.ncertChapter}`,
        subject: aiData.subject,
        classLevel: aiData.classLevel,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        difficulty: aiData.difficulty,
        ncertChapter: aiData.ncertChapter,
        totalMarks: aiData.totalMarks,
        timeEstimate: Math.ceil(aiData.questionCount * 3), // 3 minutes per question estimate
        questions: generatedQuestions,
        submissionFormat: [SubmissionFormat.PDF, SubmissionFormat.TEXT],
        teacherNotes: 'This assignment was generated using AI to provide additional practice.'
      };

      const { data: assignment, error } = await this.supabase
        .from('assignments')
        .insert({
          ...assignmentData,
          teacher_id: teacherId,
          ai_generated: true,
          ai_insights: 'Generated with focus on key learning objectives and progressive difficulty.'
        })
        .select('*')
        .single();

      if (error) {
        throw new Error('Failed to create AI assignment: ' + error.message);
      }

      console.log('✅ AI assignment generated successfully');
      return this.formatAssignmentDto(assignment, null, AssignmentStatus.PENDING);

    } catch (error) {
      console.log('❌ Error generating AI assignment:', error.message);
      throw error;
    }
  }

  async getTeacherAssignments(teacherId: string): Promise<AssignmentListResponseDto> {
    console.log('👩‍🏫 Getting assignments for teacher:', teacherId);

    try {
      const { data: assignments, error } = await this.supabase
        .from('assignments')
        .select(`
          *,
          assignment_submissions(count)
        `)
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch teacher assignments: ' + error.message);
      }

      const formattedAssignments = assignments?.map(assignment => 
        this.formatAssignmentDto(assignment, null, AssignmentStatus.PENDING)
      ) || [];

      const stats = this.calculateAssignmentStats(formattedAssignments);

      console.log('✅ Retrieved', formattedAssignments.length, 'teacher assignments');

      return {
        assignments: formattedAssignments,
        total: stats.total,
        pending: stats.pending,
        completed: stats.completed,
        overdue: stats.overdue
      };

    } catch (error) {
      console.log('❌ Error getting teacher assignments:', error.message);
      throw error;
    }
  }

  // =============================================
  // UTILITY ENDPOINTS
  // =============================================

  async getNCERTChapters(subject?: string, classLevel?: string): Promise<NCERTChapterDto[]> {
    console.log('📚 Getting NCERT chapters');

    try {
      let query = this.supabase
        .from('ncert_chapters')
        .select('*')
        .order('class_level')
        .order('chapter_number');

      if (subject) {
        query = query.eq('subject', subject);
      }
      if (classLevel) {
        query = query.eq('class_level', classLevel);
      }

      const { data: chapters, error } = await query;

      if (error) {
        throw new Error('Failed to fetch chapters: ' + error.message);
      }

      const formattedChapters = chapters?.map(chapter => ({
        id: chapter.id,
        subject: chapter.subject,
        classLevel: chapter.class_level,
        chapterNumber: chapter.chapter_number,
        chapterTitle: chapter.chapter_title,
        topics: chapter.topics,
        learningObjectives: chapter.learning_objectives,
        keywords: chapter.keywords
      })) || [];

      console.log('✅ Retrieved', formattedChapters.length, 'chapters');
      return formattedChapters;

    } catch (error) {
      console.log('❌ Error getting chapters:', error.message);
      throw error;
    }
  }

  async getStudentAssignmentStats(studentId: string): Promise<AssignmentStatsDto> {
    console.log('📊 Getting assignment stats for student:', studentId);

    try {
      // Get all assignments for student
      const assignments = await this.getStudentAssignments(studentId);
      
      const completed = assignments.assignments.filter(a => 
        a.status === AssignmentStatus.GRADED || a.status === AssignmentStatus.SUBMITTED
      );
      
      const graded = assignments.assignments.filter(a => a.status === AssignmentStatus.GRADED);
      
      const totalScore = graded.reduce((sum, a) => sum + (a.score || 0), 0);
      const totalMarks = graded.reduce((sum, a) => sum + a.totalMarks, 0);
      
      const averageScore = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;
      const overallGrade = this.calculateGrade(averageScore);

      const stats: AssignmentStatsDto = {
        totalAssignments: assignments.total,
        completedAssignments: completed.length,
        pendingAssignments: assignments.pending,
        overdueAssignments: assignments.overdue,
        averageScore: Math.round(averageScore * 100) / 100,
        overallGrade
      };

      console.log('✅ Generated assignment stats');
      return stats;

    } catch (error) {
      console.log('❌ Error getting assignment stats:', error.message);
      throw error;
    }
  }

  // =============================================
  // PRIVATE HELPER METHODS
  // =============================================

  private formatAssignmentDto(assignment: any, submission: any, status: AssignmentStatus): AssignmentDto {
    return {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      class: assignment.class_level,
      dueDate: assignment.due_date,
      status,
      aiGenerated: assignment.ai_generated,
      ncertChapter: assignment.ncert_chapter,
      difficulty: assignment.difficulty,
      totalMarks: assignment.total_marks,
      timeEstimate: `${assignment.time_estimate} minutes`,
      questions: assignment.questions || [],
      submissionFormat: assignment.submission_format,
      teacherNotes: assignment.teacher_notes,
      aiInsights: assignment.ai_insights,
      score: submission?.score,
      feedback: submission?.feedback,
      grade: submission?.grade,
      submittedAt: submission?.submitted_at
    };
  }

  private determineAssignmentStatus(assignment: any, submission: any): AssignmentStatus {
    if (submission) {
      return submission.status === 'graded' ? AssignmentStatus.GRADED : AssignmentStatus.SUBMITTED;
    }
    
    const now = new Date();
    const dueDate = new Date(assignment.due_date);
    
    return now > dueDate ? AssignmentStatus.OVERDUE : AssignmentStatus.PENDING;
  }

  private calculateAssignmentStats(assignments: AssignmentDto[]) {
    const total = assignments.length;
    const pending = assignments.filter(a => a.status === AssignmentStatus.PENDING).length;
    const completed = assignments.filter(a => 
      a.status === AssignmentStatus.SUBMITTED || a.status === AssignmentStatus.GRADED
    ).length;
    const overdue = assignments.filter(a => a.status === AssignmentStatus.OVERDUE).length;

    return { total, pending, completed, overdue };
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 33) return 'D';
    return 'F';
  }

  private async getChapterContext(subject: string, classLevel: string, chapterTitle: string) {
    const { data: chapter } = await this.supabase
      .from('ncert_chapters')
      .select('*')
      .eq('subject', subject)
      .eq('class_level', classLevel)
      .ilike('chapter_title', `%${chapterTitle}%`)
      .single();

    return chapter;
  }

  private async generateQuestionsWithAI(aiData: AIGenerateAssignmentDto, chapterContext: any): Promise<AssignmentQuestionDto[]> {
    // This is a mock AI generation - replace with actual OpenAI/Claude API integration
    const questions: AssignmentQuestionDto[] = [];
    
    for (let i = 1; i <= aiData.questionCount; i++) {
      const questionTypes = aiData.questionTypes;
      const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      let question: AssignmentQuestionDto;
      
      if (randomType === 'mcq') {
        question = {
          questionNumber: i,
          question: `Sample MCQ question ${i} for ${aiData.ncertChapter}`,
          type: 'mcq',
          marks: Math.floor(aiData.totalMarks / aiData.questionCount),
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option A'
        };
      } else {
        question = {
          questionNumber: i,
          question: `Sample ${randomType} question ${i} for ${aiData.ncertChapter}`,
          type: randomType,
          marks: Math.floor(aiData.totalMarks / aiData.questionCount)
        };
      }
      
      questions.push(question);
    }

    return questions;
  }
}
