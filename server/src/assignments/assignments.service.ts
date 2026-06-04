// server/src/assignments/assignments.service.ts

import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Create a new assignment (TEACHER or HEI_MENTOR).
   */
  async createAssignment(creatorId: string, dto: CreateAssignmentDto) {
    const { data: assignment, error } = await this.supabase.client
      .from('assignments')
      .insert({
        creator_id: creatorId,
        title: dto.title,
        ncert_reference: dto.ncert_reference ?? null,
        marking_criteria: dto.marking_criteria ?? null,
        due_date: dto.due_date ? new Date(dto.due_date).toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to create assignment: ${error.message}`);
      throw new InternalServerErrorException('Failed to create assignment');
    }

    this.logger.log(`Assignment created: ${assignment.id} by ${creatorId}`);
    return assignment;
  }

  /**
   * Submit homework for an assignment (STUDENT).
   * Saves the local file path to the submissions table.
   */
  async submitAssignment(
    assignmentId: string,
    studentId: string,
    filePath: string,
  ) {
    // Verify assignment exists
    const { data: assignment, error: findError } = await this.supabase.client
      .from('assignments')
      .select('id')
      .eq('id', assignmentId)
      .single();

    if (findError || !assignment) {
      throw new NotFoundException(`Assignment ${assignmentId} not found`);
    }

    const { data: submission, error: insertError } = await this.supabase.client
      .from('submissions')
      .insert({
        assignment_id: assignmentId,
        student_id: studentId,
        file_path: filePath,
      })
      .select()
      .single();

    if (insertError) {
      this.logger.error(`Failed to save submission: ${insertError.message}`);
      throw new InternalServerErrorException('Failed to save submission');
    }

    this.logger.log(
      `Submission ${submission.id} by student ${studentId} for assignment ${assignmentId}`,
    );

    return submission;
  }

  /** List assignments created by a specific teacher/mentor */
  async getMyAssignments(creatorId: string) {
    const { data, error } = await this.supabase.client
      .from('assignments')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error(`Failed to fetch assignments: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch assignments');
    }
    return data;
  }

  /** List all assignments (for students to see) */
  async getAllAssignments() {
    const { data, error } = await this.supabase.client
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error(`Failed to fetch assignments: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch assignments');
    }
    return data;
  }

  /** List submissions for an assignment */
  async getSubmissionsByAssignment(assignmentId: string) {
    const { data, error } = await this.supabase.client
      .from('submissions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('submitted_at', { ascending: false });

    if (error) {
      this.logger.error(`Failed to fetch submissions: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch submissions');
    }
    return data;
  }

  /** List submissions by a student */
  async getMySubmissions(studentId: string) {
    const { data, error } = await this.supabase.client
      .from('submissions')
      .select('*, assignments(*)')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false });

    if (error) {
      this.logger.error(`Failed to fetch submissions: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch submissions');
    }
    return data;
  }
}
