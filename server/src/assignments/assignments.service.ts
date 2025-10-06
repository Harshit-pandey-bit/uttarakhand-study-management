// server/src/assignments/assignments.service.ts
// ✅ REWORKED FOR HEI-MENTOR FUNCTIONALITY

import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ForbiddenException,
  Logger 
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  AssignmentDto,
  AssignmentListResponseDto,
  SubmissionDto,
  SubmissionListResponseDto,
  GradeSubmissionDto,
  AssignmentFiltersDto,
  SubmissionFiltersDto,
  AssignmentStatsDto,
  DifficultyLevel,
  AssignmentStatus,
  SubmissionStatus,
  SubmissionFormat
} from './dto/assignments.dto';

// ===============================================
// DATABASE INTERFACE DEFINITIONS
// ===============================================

interface DatabaseAssignment {
  id: string;
  title: string;
  description?: string;
  subject: string;
  class_level: string;
  teacher_id: string;
  due_date: string;
  total_marks: number;
  difficulty: DifficultyLevel;
  ai_generated: boolean;
  ncert_chapter?: string;
  time_estimate?: number;
  submission_format: string[];
  questions: any[];
  teacher_notes?: string;
  ai_insights?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Related data
  assignment_submissions?: DatabaseSubmission[];
  _count?: { assignment_submissions: number };
}

interface DatabaseSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  submission_files?: string[];
  submission_text?: string;
  submitted_at: string;
  score?: number;
  feedback?: string;
  grade?: string;
  graded_by?: string;
  graded_at?: string;
  status: SubmissionStatus;
  file_urls?: string[];
  created_at: string;
  updated_at?: string;
  // Student profile data
  student_profiles?: {
    user_id: string;
    users?: {
      id: string;
      full_name: string;
      email: string;
    };
  };
}

@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name);
  private readonly supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  // ===============================================
  // HEI-MENTOR ASSIGNMENT MANAGEMENT
  // ===============================================

  async getMentorAssignments(
    mentorId: string,
    filters: AssignmentFiltersDto
  ): Promise<AssignmentListResponseDto> {
    try {
      this.logger.log(`Getting assignments for mentor: ${mentorId}`);

      let query = this.supabase
        .from('assignments')
        .select(`
          *,
          assignment_submissions(count)
        `)
        .eq('teacher_id', mentorId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.subject) {
        query = query.eq('subject', filters.subject);
      }

      if (filters.class_level) {
        query = query.eq('class_level', filters.class_level);
      }

      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      // Handle status filter (map to is_active)
      if (filters.status) {
        if (filters.status === AssignmentStatus.PUBLISHED) {
          query = query.eq('is_active', true);
        } else if (filters.status === AssignmentStatus.ARCHIVED) {
          query = query.eq('is_active', false);
        }
        // DRAFT status would need additional logic based on due_date or other criteria
      }

      // Pagination
      const limit = filters.limit || 20;
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data: assignments, error } = await query;

      if (error) {
        throw new BadRequestException(`Failed to fetch assignments: ${error.message}`);
      }

      // Process assignments
      const processedAssignments = (assignments || []).map(assignment => 
        this.formatAssignmentDto(assignment)
      );

      // Calculate stats
      const stats = this.calculateAssignmentListStats(processedAssignments);

      this.logger.log(`Retrieved ${processedAssignments.length} assignments for mentor`);

      return {
        assignments: processedAssignments,
        total: stats.total,
        published: stats.published,
        draft: stats.draft,
        archived: stats.archived
      };

    } catch (error: any) {
      this.logger.error('Error fetching mentor assignments:', error);
      throw error;
    }
  }

  async createMentorAssignment(
    mentorId: string,
    createData: CreateAssignmentDto
  ): Promise<AssignmentDto> {
    try {
      this.logger.log(`Creating assignment for mentor: ${mentorId}`);

      const insertData = {
        title: createData.title,
        description: createData.description,
        subject: createData.subject,
        class_level: createData.class_level,
        teacher_id: mentorId,
        due_date: createData.due_date,
        total_marks: createData.total_marks || 100,
        difficulty: createData.difficulty || DifficultyLevel.MEDIUM,
        ncert_chapter: createData.ncert_chapter,
        time_estimate: createData.time_estimate,
        questions: createData.questions || [],
        submission_format: createData.submission_format || [SubmissionFormat.PDF],
        teacher_notes: createData.teacher_notes,
        ai_generated: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: assignment, error } = await this.supabase
        .from('assignments')
        .insert(insertData)
        .select('*')
        .single();

      if (error) {
        throw new BadRequestException(`Failed to create assignment: ${error.message}`);
      }

      this.logger.log(`Assignment created successfully: ${assignment.id}`);
      return this.formatAssignmentDto(assignment);

    } catch (error: any) {
      this.logger.error('Error creating assignment:', error);
      throw error;
    }
  }

  async updateMentorAssignment(
    mentorId: string,
    assignmentId: string,
    updateData: UpdateAssignmentDto
  ): Promise<AssignmentDto> {
    try {
      this.logger.log(`Updating assignment: ${assignmentId} for mentor: ${mentorId}`);

      // Verify assignment ownership
      const { data: existingAssignment } = await this.supabase
        .from('assignments')
        .select('id, teacher_id')
        .eq('id', assignmentId)
        .eq('teacher_id', mentorId)
        .single();

      if (!existingAssignment) {
        throw new NotFoundException('Assignment not found or unauthorized');
      }

      // Build update object
      const updateFields: any = {
        updated_at: new Date().toISOString()
      };

      if (updateData.title !== undefined) updateFields.title = updateData.title;
      if (updateData.description !== undefined) updateFields.description = updateData.description;
      if (updateData.due_date !== undefined) updateFields.due_date = updateData.due_date;
      if (updateData.difficulty !== undefined) updateFields.difficulty = updateData.difficulty;
      if (updateData.ncert_chapter !== undefined) updateFields.ncert_chapter = updateData.ncert_chapter;
      if (updateData.total_marks !== undefined) updateFields.total_marks = updateData.total_marks;
      if (updateData.time_estimate !== undefined) updateFields.time_estimate = updateData.time_estimate;
      if (updateData.questions !== undefined) updateFields.questions = updateData.questions;
      if (updateData.teacher_notes !== undefined) updateFields.teacher_notes = updateData.teacher_notes;

      // Handle status updates
      if (updateData.status !== undefined) {
        if (updateData.status === AssignmentStatus.ARCHIVED) {
          updateFields.is_active = false;
        } else if (updateData.status === AssignmentStatus.PUBLISHED) {
          updateFields.is_active = true;
        }
      }

      const { data: updatedAssignment, error } = await this.supabase
        .from('assignments')
        .update(updateFields)
        .eq('id', assignmentId)
        .select('*')
        .single();

      if (error) {
        throw new BadRequestException(`Failed to update assignment: ${error.message}`);
      }

      this.logger.log(`Assignment updated successfully: ${assignmentId}`);
      return this.formatAssignmentDto(updatedAssignment);

    } catch (error: any) {
      this.logger.error('Error updating assignment:', error);
      throw error;
    }
  }

  async deleteMentorAssignment(mentorId: string, assignmentId: string): Promise<void> {
    try {
      this.logger.log(`Deleting assignment: ${assignmentId} for mentor: ${mentorId}`);

      // Verify assignment ownership and check for submissions
      const { data: assignment, error: fetchError } = await this.supabase
        .from('assignments')
        .select(`
          id, 
          teacher_id,
          assignment_submissions(count)
        `)
        .eq('id', assignmentId)
        .eq('teacher_id', mentorId)
        .single();

      if (fetchError || !assignment) {
        throw new NotFoundException('Assignment not found or unauthorized');
      }

      // Check if there are submissions
      const submissionCount = assignment.assignment_submissions?.[0]?.count || 0;
      if (submissionCount > 0) {
        throw new BadRequestException('Cannot delete assignment with existing submissions');
      }

      // Delete the assignment
      const { error: deleteError } = await this.supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (deleteError) {
        throw new BadRequestException(`Failed to delete assignment: ${deleteError.message}`);
      }

      this.logger.log(`Assignment deleted successfully: ${assignmentId}`);

    } catch (error: any) {
      this.logger.error('Error deleting assignment:', error);
      throw error;
    }
  }

  // ===============================================
  // SUBMISSION MANAGEMENT
  // ===============================================

  async getAssignmentSubmissions(
    mentorId: string,
    assignmentId: string,
    filters: SubmissionFiltersDto
  ): Promise<SubmissionListResponseDto> {
    try {
      this.logger.log(`Getting submissions for assignment: ${assignmentId}`);

      // Verify assignment ownership
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('id, teacher_id')
        .eq('id', assignmentId)
        .eq('teacher_id', mentorId)
        .single();

      if (!assignment) {
        throw new NotFoundException('Assignment not found or unauthorized');
      }

      let query = this.supabase
        .from('assignment_submissions')
        .select(`
          *,
          student_profiles!assignment_submissions_student_id_fkey(
            user_id,
            users!student_profiles_user_id_fkey(
              id,
              full_name,
              email
            )
          )
        `)
        .eq('assignment_id', assignmentId)
        .order('submitted_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // Pagination
      const limit = filters.limit || 20;
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data: submissions, error } = await query;

      if (error) {
        throw new BadRequestException(`Failed to fetch submissions: ${error.message}`);
      }

      // Process submissions
      const processedSubmissions = (submissions || []).map(submission => 
        this.formatSubmissionDto(submission)
      );

      // Calculate stats
      const stats = this.calculateSubmissionStats(processedSubmissions);

      this.logger.log(`Retrieved ${processedSubmissions.length} submissions`);

      return {
        submissions: processedSubmissions,
        total: stats.total,
        graded: stats.graded,
        pending: stats.pending,
        average_score: stats.averageScore
      };

    } catch (error: any) {
      this.logger.error('Error fetching submissions:', error);
      throw error;
    }
  }

  async gradeSubmission(
    mentorId: string,
    submissionId: string,
    gradeData: GradeSubmissionDto
  ): Promise<SubmissionDto> {
    try {
      this.logger.log(`Grading submission: ${submissionId} by mentor: ${mentorId}`);

      // Verify submission exists and mentor owns the assignment
      const { data: submission, error: fetchError } = await this.supabase
        .from('assignment_submissions')
        .select(`
          *,
          assignments!assignment_submissions_assignment_id_fkey(
            id,
            teacher_id,
            total_marks
          )
        `)
        .eq('id', submissionId)
        .single();

      if (fetchError || !submission) {
        throw new NotFoundException('Submission not found');
      }

      if (submission.assignments?.teacher_id !== mentorId) {
        throw new ForbiddenException('Unauthorized to grade this submission');
      }

      // Calculate grade if not provided
      let calculatedGrade = gradeData.grade;
      if (!calculatedGrade && gradeData.score !== undefined) {
        const totalMarks = submission.assignments?.total_marks || 100;
        const percentage = (gradeData.score / totalMarks) * 100;
        calculatedGrade = this.calculateGradeFromPercentage(percentage);
      }

      const updateData = {
        score: gradeData.score,
        feedback: gradeData.feedback,
        grade: calculatedGrade,
        graded_by: mentorId,
        graded_at: new Date().toISOString(),
        status: SubmissionStatus.GRADED,
        updated_at: new Date().toISOString()
      };

      const { data: updatedSubmission, error: updateError } = await this.supabase
        .from('assignment_submissions')
        .update(updateData)
        .eq('id', submissionId)
        .select(`
          *,
          student_profiles!assignment_submissions_student_id_fkey(
            user_id,
            users!student_profiles_user_id_fkey(
              id,
              full_name,
              email
            )
          )
        `)
        .single();

      if (updateError) {
        throw new BadRequestException(`Failed to grade submission: ${updateError.message}`);
      }

      this.logger.log(`Submission graded successfully: ${submissionId}`);
      return this.formatSubmissionDto(updatedSubmission);

    } catch (error: any) {
      this.logger.error('Error grading submission:', error);
      throw error;
    }
  }

  // ===============================================
  // STATISTICS & ANALYTICS
  // ===============================================

  async getMentorAssignmentStats(mentorId: string): Promise<AssignmentStatsDto> {
    try {
      this.logger.log(`Getting assignment statistics for mentor: ${mentorId}`);

      const { data: assignments, error } = await this.supabase
        .from('assignments')
        .select(`
          id,
          subject,
          is_active,
          assignment_submissions(
            id,
            score,
            status
          )
        `)
        .eq('teacher_id', mentorId);

      if (error) {
        throw new BadRequestException(`Failed to fetch statistics: ${error.message}`);
      }

      const stats = this.calculateMentorStats(assignments || []);

      this.logger.log('Assignment statistics calculated successfully');
      return stats;

    } catch (error: any) {
      this.logger.error('Error fetching assignment stats:', error);
      throw error;
    }
  }

  // ===============================================
  // PRIVATE HELPER METHODS
  // ===============================================

  private formatAssignmentDto(assignment: DatabaseAssignment): AssignmentDto {
    return {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      class_level: assignment.class_level,
      due_date: assignment.due_date,
      difficulty: assignment.difficulty,
      ncert_chapter: assignment.ncert_chapter,
      total_marks: assignment.total_marks,
      time_estimate: assignment.time_estimate,
      questions: assignment.questions || [],
      submission_format: assignment.submission_format as SubmissionFormat[],
      teacher_notes: assignment.teacher_notes,
      ai_generated: assignment.ai_generated,
      is_active: assignment.is_active,
      submission_count: assignment.assignment_submissions?.length || 0,
      created_at: assignment.created_at,
      updated_at: assignment.updated_at
    };
  }

  private formatSubmissionDto(submission: DatabaseSubmission): SubmissionDto {
    const studentUser = submission.student_profiles?.users;

    return {
      id: submission.id,
      assignment_id: submission.assignment_id,
      student_id: submission.student_id,
      student_name: studentUser?.full_name || 'Unknown Student',
      student_email: studentUser?.email || '',
      submission_files: submission.submission_files,
      submission_text: submission.submission_text,
      submitted_at: submission.submitted_at,
      score: submission.score,
      feedback: submission.feedback,
      grade: submission.grade,
      status: submission.status,
      created_at: submission.created_at,
      graded_at: submission.graded_at
    };
  }

  private calculateAssignmentListStats(assignments: AssignmentDto[]) {
    return {
      total: assignments.length,
      published: assignments.filter(a => a.is_active).length,
      draft: 0, // Would need additional logic for draft status
      archived: assignments.filter(a => !a.is_active).length
    };
  }

  private calculateSubmissionStats(submissions: SubmissionDto[]) {
    const total = submissions.length;
    const graded = submissions.filter(s => s.status === SubmissionStatus.GRADED).length;
    const pending = total - graded;

    const scores = submissions
      .filter(s => s.score !== null && s.score !== undefined)
      .map(s => s.score!);

    const averageScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;

    return {
      total,
      graded,
      pending,
      averageScore: Math.round(averageScore * 10) / 10
    };
  }

  private calculateMentorStats(assignments: any[]): AssignmentStatsDto {
    const totalAssignments = assignments.length;
    const publishedAssignments = assignments.filter(a => a.is_active).length;
    const draftAssignments = totalAssignments - publishedAssignments;

    const allSubmissions = assignments.flatMap(a => a.assignment_submissions || []);
    const totalSubmissions = allSubmissions.length;
    const gradedSubmissions = allSubmissions.filter(s => s.status === 'graded').length;
    const pendingSubmissions = totalSubmissions - gradedSubmissions;

    const scores = allSubmissions
      .filter(s => s.score !== null && s.score !== undefined)
      .map(s => s.score);

    const averageScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;

    // Subject breakdown
    const subjectBreakdown: Record<string, number> = {};
    assignments.forEach(assignment => {
      const subject = assignment.subject;
      subjectBreakdown[subject] = (subjectBreakdown[subject] || 0) + 1;
    });

    return {
      total_assignments: totalAssignments,
      published_assignments: publishedAssignments,
      draft_assignments: draftAssignments,
      total_submissions: totalSubmissions,
      graded_submissions: gradedSubmissions,
      pending_submissions: pendingSubmissions,
      average_score: Math.round(averageScore * 10) / 10,
      subject_breakdown: subjectBreakdown
    };
  }

  private calculateGradeFromPercentage(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 33) return 'D';
    return 'F';
  }
}
