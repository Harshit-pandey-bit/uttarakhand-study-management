// // server/src/assignments/assignments.controller.ts

// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Body,
//   Param,
//   Query,
//   UseGuards,
//   Request,
//   HttpCode,
//   HttpStatus,
//   ValidationPipe,
//   ParseUUIDPipe,
//   BadRequestException,
//   Logger,
//   UseInterceptors,
//   UploadedFile,
//   UploadedFiles,
//   ParseFilePipe,
//   MaxFileSizeValidator,
//   FileTypeValidator,
// } from '@nestjs/common';
// import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
//   ApiParam,
//   ApiQuery,
//   ApiBody,
//   ApiBadRequestResponse,
//   ApiUnauthorizedResponse,
//   ApiNotFoundResponse,
//   ApiConsumes,
// } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';
// import { AssignmentsService } from './assignments.service';
// import {
//   AssignmentDto,
//   AssignmentListResponseDto,
//   CreateAssignmentDto,
//   AIGenerateAssignmentDto,
//   SubmitAssignmentDto,
//   AssignmentSubmissionDto,
//   NCERTChapterDto,
//   AssignmentStatsDto,
//   AssignmentStatus,
//   AssignmentAttachmentDto,
//   DifficultyLevel,
//   SearchAssignmentsDto,
//   SubjectProgressDto,
//   AssignmentDashboardSummaryDto,
//   FileUploadResponseDto,
// } from './dto/assignments.dto';

// @ApiTags('Assignments')
// @Controller('assignments')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth()
// export class AssignmentsController {
//   private readonly logger = new Logger(AssignmentsController.name);

//   constructor(private readonly assignmentsService: AssignmentsService) {}

//   // =============================================
//   // FILE UPLOAD ENDPOINTS
//   // =============================================

//   @Post('upload-file')
//   @HttpCode(HttpStatus.CREATED)
//   @UseInterceptors(FileInterceptor('file'))
//   @ApiConsumes('multipart/form-data')
//   @ApiOperation({
//     summary: 'Upload assignment file',
//     description: 'Upload a file for assignment submission (PDF, DOC, DOCX, JPG, PNG)'
//   })
//   @ApiBody({
//     description: 'File upload',
//     schema: {
//       type: 'object',
//       properties: {
//         file: {
//           type: 'string',
//           format: 'binary',
//           description: 'Assignment file (max 10MB)'
//         },
//         assignmentId: {
//           type: 'string',
//           description: 'Assignment UUID (optional)'
//         }
//       }
//     }
//   })
//   @ApiResponse({
//     status: 201,
//     description: 'File uploaded successfully',
//     type: FileUploadResponseDto
//   })
//   @ApiBadRequestResponse({ description: 'Invalid file or file too large' })
//   async uploadAssignmentFile(
//     @UploadedFile(
//       new ParseFilePipe({
//         validators: [
//           new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
//           new FileTypeValidator({ 
//             fileType: /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|image\/jpeg|image\/png|image\/jpg)$/
//           }),
//         ],
//       }),
//     ) file: Express.Multer.File,
//     @Body('assignmentId') assignmentId: string,
//     @Request() req
//   ): Promise<FileUploadResponseDto> {
//     const userId = req.user?.sub || req.user?.id;
//     this.logger.log(`Uploading file for user: ${userId}`);

//     if (req.user?.role !== 'student') {
//       throw new BadRequestException('Only students can upload assignment files');
//     }

//     return this.assignmentsService.uploadAssignmentFile(file, userId, assignmentId);
//   }

//   @Post('upload-multiple')
//   @HttpCode(HttpStatus.CREATED)
//   @UseInterceptors(FilesInterceptor('files', 5)) // Max 5 files
//   @ApiConsumes('multipart/form-data')
//   @ApiOperation({
//     summary: 'Upload multiple assignment files',
//     description: 'Upload multiple files for assignment submission (max 5 files, 10MB each)'
//   })
//   @ApiResponse({
//     status: 201,
//     description: 'Files uploaded successfully',
//     type: [FileUploadResponseDto]
//   })
//   async uploadMultipleFiles(
//     @UploadedFiles(
//       new ParseFilePipe({
//         validators: [
//           new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB per file
//           new FileTypeValidator({ 
//             fileType: /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|image\/jpeg|image\/png|image\/jpg)$/
//           }),
//         ],
//       }),
//     ) files: Express.Multer.File[],
//     @Body('assignmentId') assignmentId: string,
//     @Request() req
//   ): Promise<FileUploadResponseDto[]> {
//     const userId = req.user?.sub || req.user?.id;
//     this.logger.log(`Uploading ${files.length} files for user: ${userId}`);

//     if (req.user?.role !== 'student') {
//       throw new BadRequestException('Only students can upload assignment files');
//     }

//     const uploadPromises = files.map(file => 
//       this.assignmentsService.uploadAssignmentFile(file, userId, assignmentId)
//     );

//     return Promise.all(uploadPromises);
//   }

//   @Delete('files/:filePath')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @ApiOperation({
//     summary: 'Delete uploaded file',
//     description: 'Delete a previously uploaded assignment file'
//   })
//   @ApiParam({ name: 'filePath', description: 'File path to delete' })
//   @ApiResponse({ status: 204, description: 'File deleted successfully' })
//   async deleteAssignmentFile(
//     @Param('filePath') filePath: string,
//     @Request() req
//   ): Promise<void> {
//     const userId = req.user?.sub || req.user?.id;
//     this.logger.log(`Deleting file: ${filePath} for user: ${userId}`);

//     if (req.user?.role !== 'student') {
//       throw new BadRequestException('Only students can delete their assignment files');
//     }

//     return this.assignmentsService.deleteAssignmentFile(filePath, userId);
//   }

//   // =============================================
//   // STUDENT ASSIGNMENT ENDPOINTS (Updated)
//   // =============================================

//   @Get('my-assignments')
//   @ApiOperation({
//     summary: 'Get current student assignments',
//     description: 'Retrieve all assignments for the authenticated student'
//   })
//   @ApiQuery({ name: 'status', enum: AssignmentStatus, required: false })
//   @ApiQuery({ name: 'subject', type: 'string', required: false })
//   @ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
//   @ApiQuery({ name: 'offset', type: 'number', required: false, example: 0 })
//   @ApiResponse({
//     status: 200,
//     description: 'Assignments retrieved successfully',
//     type: AssignmentListResponseDto
//   })
//   @ApiUnauthorizedResponse({ description: 'Authentication required' })
//   async getMyAssignments(
//     @Request() req,
//     @Query('status') status?: AssignmentStatus,
//     @Query('subject') subject?: string,
//     @Query('limit') limit: number = 20,
//     @Query('offset') offset: number = 0
//   ): Promise<AssignmentListResponseDto> {
//     const studentId = req.user?.sub || req.user?.id;
//     this.logger.log(`Getting assignments for student: ${studentId}`);
    
//     if (req.user?.role !== 'student') {
//       throw new BadRequestException('This endpoint is only for students');
//     }

//     return this.assignmentsService.getStudentAssignments(studentId, status, subject, limit, offset);
//   }

//   @Post(':assignmentId/submit')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Submit assignment with files',
//     description: 'Submit completed assignment with uploaded files and/or text content'
//   })
//   @ApiParam({ name: 'assignmentId', type: 'string', description: 'Assignment UUID' })
//   @ApiBody({ 
//     type: SubmitAssignmentDto,
//     description: 'Submission data with file URLs and/or text content'
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Assignment submitted successfully',
//     type: AssignmentSubmissionDto
//   })
//   @ApiBadRequestResponse({ description: 'Invalid submission or assignment already submitted' })
//   async submitAssignment(
//     @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
//     @Body(ValidationPipe) submitData: Omit<SubmitAssignmentDto, 'assignmentId'>,
//     @Request() req
//   ): Promise<AssignmentSubmissionDto> {
//     const studentId = req.user?.sub || req.user?.id;
//     this.logger.log(`Submitting assignment: ${assignmentId} for student: ${studentId}`);
    
//     if (req.user?.role !== 'student') {
//       throw new BadRequestException('Only students can submit assignments');
//     }

//     const fullSubmitData: SubmitAssignmentDto = {
//       assignmentId,
//       ...submitData
//     };

//     return this.assignmentsService.submitAssignment(studentId, fullSubmitData);
//   }

//   @Get('my-submissions/history')
//   @ApiOperation({
//     summary: 'Get student submission history',
//     description: 'Retrieve all submissions made by the authenticated student with file information'
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Submission history retrieved successfully',
//     type: [AssignmentSubmissionDto]
//   })
//   async getMySubmissions(@Request() req): Promise<AssignmentSubmissionDto[]> {
//     const studentId = req.user?.sub || req.user?.id;
//     this.logger.log(`Getting submission history for student: ${studentId}`);
    
//     if (req.user?.role !== 'student') {
//       throw new BadRequestException('This endpoint is only for students');
//     }

//     return this.assignmentsService.getStudentSubmissions(studentId);
//   }

//   // =============================================
//   // KEEP ALL OTHER EXISTING ENDPOINTS
//   // =============================================

//   @Get(':assignmentId')
//   @ApiOperation({
//     summary: 'Get assignment details',
//     description: 'Get detailed information about a specific assignment'
//   })
//   @ApiParam({ name: 'assignmentId', type: 'string', description: 'Assignment UUID' })
//   @ApiResponse({
//     status: 200,
//     description: 'Assignment details retrieved successfully',
//     type: AssignmentDto
//   })
//   @ApiNotFoundResponse({ description: 'Assignment not found' })
//   async getAssignmentDetails(
//     @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
//     @Request() req
//   ): Promise<AssignmentDto> {
//     const userId = req.user?.sub || req.user?.id;
//     this.logger.log(`Getting assignment details: ${assignmentId}`);

//     if (req.user?.role === 'student') {
//       return this.assignmentsService.getAssignmentById(assignmentId, userId);
//     } else {
//       // Teachers can view any assignment
//       return this.assignmentsService.getAssignmentById(assignmentId, "");
//     }
//   }

//   @Get('my-stats')
//   @ApiOperation({
//     summary: 'Get student assignment statistics',
//     description: 'Get comprehensive statistics about student assignment performance'
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Assignment statistics retrieved successfully',
//     type: AssignmentStatsDto
//   })
//   async getMyAssignmentStats(@Request() req): Promise<AssignmentStatsDto> {
//     const studentId = req.user?.sub || req.user?.id;
//     this.logger.log(`Getting assignment stats for student: ${studentId}`);
    
//     if (req.user?.role !== 'student') {
//       throw new BadRequestException('This endpoint is only for students');
//     }

//     return this.assignmentsService.getStudentAssignmentStats(studentId);
//   }

//   @Get('dashboard/summary')
//   @ApiOperation({
//     summary: 'Get dashboard summary with counts',
//     description: 'Get comprehensive dashboard overview with statistics and counts'
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Dashboard summary retrieved successfully',
//     type: AssignmentDashboardSummaryDto
//   })
//   async getDashboardSummary(@Request() req): Promise<AssignmentDashboardSummaryDto> {
//     const studentId = req.user?.sub || req.user?.id;
//     this.logger.log(`Getting dashboard summary for student: ${studentId}`);
    
//     if (req.user?.role !== 'student') {
//       throw new BadRequestException('This endpoint is only for students');
//     }

//     return this.assignmentsService.getStudentAssignmentDashboardSummary(studentId);
//   }

//   @Get('my-progress/subjects')
//   @ApiOperation({
//     summary: 'Get subject-wise progress',
//     description: 'Get detailed progress and statistics for each subject'
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Subject progress retrieved successfully',
//     type: [SubjectProgressDto]
//   })
//   async getMySubjectProgress(@Request() req): Promise<SubjectProgressDto[]> {
//     const studentId = req.user?.sub || req.user?.id;
//     this.logger.log(`Getting subject progress for student: ${studentId}`);
    
//     if (req.user?.role !== 'student') {
//       throw new BadRequestException('This endpoint is only for students');
//     }

//     return this.assignmentsService.getStudentSubjectProgress(studentId);
//   }

//   // =============================================
//   // TEACHER ASSIGNMENT ENDPOINTS
//   // =============================================

//   @Post('create')
//   @HttpCode(HttpStatus.CREATED)
//   @ApiOperation({
//     summary: 'Create new assignment',
//     description: 'Create a new assignment manually (teachers only)'
//   })
//   @ApiBody({ type: CreateAssignmentDto })
//   @ApiResponse({
//     status: 201,
//     description: 'Assignment created successfully',
//     type: AssignmentDto
//   })
//   @ApiBadRequestResponse({ description: 'Invalid assignment data' })
//   async createAssignment(
//     @Body(ValidationPipe) createData: CreateAssignmentDto,
//     @Request() req
//   ): Promise<AssignmentDto> {
//     const teacherId = req.user?.sub || req.user?.id;
//     this.logger.log(`Creating assignment for teacher: ${teacherId}`);

//     if (!['teacher', 'hei_mentor', 'school_admin'].includes(req.user?.role)) {
//       throw new BadRequestException('Only teachers can create assignments');
//     }

//     return this.assignmentsService.createAssignment(teacherId, createData);
//   }

//   @Post('generate-ai')
//   @HttpCode(HttpStatus.CREATED)
//   @ApiOperation({
//     summary: 'Generate AI assignment',
//     description: 'Generate assignment using AI based on NCERT chapter and requirements'
//   })
//   @ApiBody({ type: AIGenerateAssignmentDto })
//   @ApiResponse({
//     status: 201,
//     description: 'AI assignment generated successfully',
//     type: AssignmentDto
//   })
//   @ApiBadRequestResponse({ description: 'Invalid generation parameters' })
//   async generateAIAssignment(
//     @Body(ValidationPipe) aiData: AIGenerateAssignmentDto,
//     @Request() req
//   ): Promise<AssignmentDto> {
//     const teacherId = req.user?.sub || req.user?.id;
//     this.logger.log(`Generating AI assignment for teacher: ${teacherId}`);

//     if (!['teacher', 'hei_mentor', 'school_admin'].includes(req.user?.role)) {
//       throw new BadRequestException('Only teachers can generate AI assignments');
//     }

//     return this.assignmentsService.generateAIAssignment(teacherId, aiData);
//   }

//   @Get('my-created')
//   @ApiOperation({
//     summary: 'Get teacher created assignments',
//     description: 'Retrieve all assignments created by the authenticated teacher'
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Teacher assignments retrieved successfully',
//     type: AssignmentListResponseDto
//   })
//   async getMyCreatedAssignments(@Request() req): Promise<AssignmentListResponseDto> {
//     const teacherId = req.user?.sub || req.user?.id;
//     this.logger.log(`Getting created assignments for teacher: ${teacherId}`);

//     if (!['teacher', 'hei_mentor', 'school_admin'].includes(req.user?.role)) {
//       throw new BadRequestException('Only teachers can view created assignments');
//     }

//     return this.assignmentsService.getTeacherAssignments(teacherId);
//   }

//   // =============================================
//   // UTILITY ENDPOINTS
//   // =============================================

//   @Get('ncert/chapters')
//   @ApiOperation({
//     summary: 'Get NCERT chapters',
//     description: 'Retrieve NCERT chapters for assignment creation'
//   })
//   @ApiQuery({ name: 'subject', type: 'string', required: false })
//   @ApiQuery({ name: 'classLevel', type: 'string', required: false })
//   @ApiResponse({
//     status: 200,
//     description: 'NCERT chapters retrieved successfully',
//     type: [NCERTChapterDto]
//   })
//   async getNCERTChapters(
//     @Query('subject') subject?: string,
//     @Query('classLevel') classLevel?: string
//   ): Promise<NCERTChapterDto[]> {
//     this.logger.log('Getting NCERT chapters');
//     return this.assignmentsService.getNCERTChapters(subject, classLevel);
//   }

//   @Get('subjects/list')
//   @ApiOperation({
//     summary: 'Get available subjects',
//     description: 'Get list of available subjects for assignments'
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Subjects retrieved successfully',
//     schema: {
//       type: 'object',
//       properties: {
//         subjects: {
//           type: 'array',
//           items: { type: 'string' },
//           example: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies']
//         }
//       }
//     }
//   })
//   async getAvailableSubjects(): Promise<{ subjects: string[] }> {
//     this.logger.log('Getting available subjects');
//     // This could be dynamic from database or config
//     const subjects = [
//       'Mathematics',
//       'Science',
//       'Physics',
//       'Chemistry',
//       'Biology',
//       'English',
//       'Hindi',
//       'Social Studies',
//       'History',
//       'Geography',
//       'Economics',
//       'Political Science'
//     ];
//     return { subjects };
//   }

//   @Get('classes/list')
//   @ApiOperation({
//     summary: 'Get available class levels',
//     description: 'Get list of available class levels for assignments'
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Class levels retrieved successfully',
//     schema: {
//       type: 'object',
//       properties: {
//         classes: {
//           type: 'array',
//           items: { type: 'string' },
//           example: ['6th', '7th', '8th', '9th', '10th', '11th', '12th']
//         }
//       }
//     }
//   })
//   async getAvailableClasses(): Promise<{ classes: string[] }> {
//     this.logger.log('Getting available classes');
//     const classes = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];
//     return { classes };
//   }

//   // =============================================
//   // SEARCH & FILTERING ENDPOINTS
//   // =============================================

//   @Get('search')
//   @ApiOperation({
//     summary: 'Advanced search/filtering',
//     description: 'Search assignments with advanced filters and parameters'
//   })
//   @ApiQuery({ name: 'query', type: 'string', required: false, description: 'Search term' })
//   @ApiQuery({ name: 'subject', type: 'string', required: false })
//   @ApiQuery({ name: 'status', enum: AssignmentStatus, required: false })
//   @ApiQuery({ name: 'difficulty', enum: DifficultyLevel, required: false })
//   @ApiQuery({ name: 'dueDateFrom', type: 'string', required: false })
//   @ApiQuery({ name: 'dueDateTo', type: 'string', required: false })
//   @ApiQuery({ name: 'aiGenerated', type: 'boolean', required: false })
//   @ApiQuery({ name: 'ncertChapter', type: 'string', required: false })
//   @ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
//   @ApiQuery({ name: 'offset', type: 'number', required: false, example: 0 })
//   @ApiResponse({
//     status: 200,
//     description: 'Search results retrieved successfully',
//     type: AssignmentListResponseDto
//   })
//   async searchAssignments(
//     @Request() req,
//     @Query('query') query?: string,
//     @Query('subject') subject?: string,
//     @Query('status') status?: AssignmentStatus,
//     @Query('difficulty') difficulty?: DifficultyLevel,
//     @Query('dueDateFrom') dueDateFrom?: string,
//     @Query('dueDateTo') dueDateTo?: string,
//     @Query('aiGenerated') aiGenerated?: boolean,
//     @Query('ncertChapter') ncertChapter?: string,
//     @Query('limit') limit: number = 20,
//     @Query('offset') offset: number = 0
//   ): Promise<AssignmentListResponseDto> {
//     const studentId = req.user?.sub || req.user?.id;
//     this.logger.log(`Searching assignments for student: ${studentId}`);

//     if (req.user?.role !== 'student') {
//       throw new BadRequestException('This endpoint is only for students');
//     }

//     const searchParams: SearchAssignmentsDto = {
//       query,
//       subject,
//       status,
//       difficulty,
//       dueDateFrom,
//       dueDateTo,
//       aiGenerated,
//       ncertChapter
//     };

//     return this.assignmentsService.searchStudentAssignments(studentId, searchParams, limit, offset);
//   }

//   @Get(':assignmentId/attachments')
//   @ApiOperation({
//     summary: 'Get assignment attachments',
//     description: 'Get file attachments for a specific assignment'
//   })
//   @ApiParam({ name: 'assignmentId', type: 'string', description: 'Assignment UUID' })
//   @ApiResponse({
//     status: 200,
//     description: 'Assignment attachments retrieved successfully',
//     type: [AssignmentAttachmentDto]
//   })
//   async getAssignmentAttachments(
//     @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
//     @Request() req
//   ): Promise<AssignmentAttachmentDto[]> {
//     this.logger.log(`Getting attachments for assignment: ${assignmentId}`);

//     // Verify user can access this assignment
//     if (req.user?.role === 'student') {
//       const userId = req.user?.sub || req.user?.id;
//       await this.assignmentsService.getAssignmentById(assignmentId, userId);
//     }

//     return this.assignmentsService.getAssignmentAttachments(assignmentId);
//   }

//     // ===================== TEACHER DASHBOARD ENDPOINTS =====================

//   @Get('teacher/dashboard')
//   @ApiOperation({
//     summary: 'Get teacher dashboard overview',
//     description: 'Dashboard statistics and overview for teachers including pending grading'
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Teacher dashboard data retrieved successfully',
//     schema: {
//       type: 'object',
//       properties: {
//         totalAssignments: { type: 'number' },
//         formativeAssignments: { type: 'number' },
//         summativeAssignments: { type: 'number' },
//         activeAssignments: { type: 'number' },
//         totalSubmissions: { type: 'number' },
//         pendingGrading: { type: 'number' },
//         averageScore: { type: 'number' },
//         needsGrading: { type: 'array' },
//         recentAssignments: { type: 'array' }
//       }
//     }
//   })
//   @ApiBadRequestResponse({ description: 'Invalid request or server error' })
//   @ApiUnauthorizedResponse({ description: 'User not authenticated' })
//   async getTeacherDashboard(@Request() req) {
//     const teacherId = req.user?.sub || req.user?.id;
    
//     if (!['teacher', 'hei_mentor', 'school_admin'].includes(req.user?.role)) {
//       throw new BadRequestException('Only teachers can access teacher dashboard');
//     }
    
//     return this.assignmentsService.getTeacherDashboard(teacherId);
//   }

//   @Get('teacher/submissions/:assignmentId')
//   @ApiOperation({
//     summary: 'Get all submissions for an assignment',
//     description: 'View all student submissions and answers for a specific assignment (teachers only)'
//   })
//   @ApiParam({ 
//     name: 'assignmentId', 
//     type: 'string', 
//     description: 'Assignment UUID',
//     example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
//   })
//   @ApiQuery({ 
//     name: 'status', 
//     enum: ['submitted', 'graded', 'pending'], 
//     required: false,
//     description: 'Filter submissions by status'
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Assignment submissions retrieved successfully',
//     schema: {
//       type: 'object',
//       properties: {
//         assignment: { 
//           type: 'object',
//           properties: {
//             id: { type: 'string' },
//             title: { type: 'string' },
//             totalMarks: { type: 'number' },
//             questions: { type: 'array' },
//             isFormative: { type: 'boolean' }
//           }
//         },
//         submissions: { type: 'array' },
//         totalSubmissions: { type: 'number' },
//         pendingGrading: { type: 'number' },
//         averageScore: { type: 'number' }
//       }
//     }
//   })
//   @ApiBadRequestResponse({ description: 'Invalid assignment ID or unauthorized' })
//   @ApiNotFoundResponse({ description: 'Assignment not found' })
//   async getAssignmentSubmissions(
//     @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
//     @Query('status') status?: string,
//     @Request() req
//   ) {
//     const teacherId = req.user?.sub || req.user?.id;
    
//     if (!['teacher', 'hei_mentor', 'school_admin'].includes(req.user?.role)) {
//       throw new BadRequestException('Only teachers can view submissions');
//     }
    
//     return this.assignmentsService.getAssignmentSubmissions(assignmentId, teacherId, status);
//   }

//   @Put('teacher/:assignmentId/grade')
//   @ApiOperation({
//     summary: 'Grade student submission',
//     description: 'Grade student answers and provide feedback for assignment submission'
//   })
//   @ApiParam({ 
//     name: 'assignmentId', 
//     type: 'string', 
//     description: 'Assignment UUID',
//     example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
//   })
//   @ApiBody({
//     description: 'Grading data for student submission',
//     schema: {
//       type: 'object',
//       properties: {
//         studentId: { 
//           type: 'string', 
//           description: 'Student UUID',
//           example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012'
//         },
//         score: { 
//           type: 'number', 
//           description: 'Score out of total marks',
//           example: 85,
//           minimum: 0
//         },
//         grade: { 
//           type: 'string', 
//           description: 'Letter grade (auto-calculated if not provided)',
//           example: 'A',
//           required: false
//         },
//         feedback: { 
//           type: 'string', 
//           description: 'Teacher feedback for student',
//           example: 'Good work! Pay attention to question 3 next time.',
//           required: false
//         }
//       },
//       required: ['studentId', 'score']
//     }
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Submission graded successfully',
//     schema: {
//       type: 'object',
//       properties: {
//         success: { type: 'boolean' },
//         submission: {
//           type: 'object',
//           properties: {
//             id: { type: 'string' },
//             score: { type: 'number' },
//             grade: { type: 'string' },
//             feedback: { type: 'string' },
//             percentage: { type: 'number' }
//           }
//         },
//         gradedAt: { type: 'string', format: 'date-time' }
//       }
//     }
//   })
//   @ApiBadRequestResponse({ description: 'Invalid score or assignment not found' })
//   @ApiNotFoundResponse({ description: 'Assignment or submission not found' })
//   async gradeSubmission(
//     @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
//     @Body() gradeData: {
//       studentId: string;
//       score: number;
//       grade?: string;
//       feedback?: string;
//     },
//     @Request() req
//   ) {
//     const teacherId = req.user?.sub || req.user?.id;
    
//     if (!['teacher', 'hei_mentor', 'school_admin'].includes(req.user?.role)) {
//       throw new BadRequestException('Only teachers can grade submissions');
//     }

//     // Validate required fields
//     if (!gradeData.studentId || gradeData.score === undefined || gradeData.score === null) {
//       throw new BadRequestException('Student ID and score are required');
//     }

//     // Validate score is a number
//     if (typeof gradeData.score !== 'number' || gradeData.score < 0) {
//       throw new BadRequestException('Score must be a valid non-negative number');
//     }
    
//     return this.assignmentsService.gradeSubmission(assignmentId, teacherId, gradeData);
//   }

//   @Put(':assignmentId')
//   @ApiOperation({
//     summary: 'Update assignment',
//     description: 'Update assignment details (teachers only). Limited updates allowed if submissions exist.'
//   })
//   @ApiParam({ 
//     name: 'assignmentId', 
//     type: 'string', 
//     description: 'Assignment UUID',
//     example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
//   })
//   @ApiBody({ 
//     type: CreateAssignmentDto,
//     description: 'Updated assignment data. Note: Questions and total marks cannot be changed if submissions exist.'
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Assignment updated successfully',
//     type: AssignmentDto
//   })
//   @ApiBadRequestResponse({ description: 'Invalid assignment data or unauthorized' })
//   @ApiNotFoundResponse({ description: 'Assignment not found' })
//   async updateAssignment(
//     @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
//     @Body(ValidationPipe) updateData: Partial<CreateAssignmentDto>,
//     @Request() req
//   ): Promise<AssignmentDto> {
//     const teacherId = req.user?.sub || req.user?.id;
    
//     if (!['teacher', 'hei_mentor', 'school_admin'].includes(req.user?.role)) {
//       throw new BadRequestException('Only teachers can update assignments');
//     }
    
//     return this.assignmentsService.updateAssignment(assignmentId, teacherId, updateData);
//   }

//   @Delete(':assignmentId')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @ApiOperation({
//     summary: 'Delete assignment',
//     description: 'Delete assignment (teachers only). Cannot delete if submissions exist.'
//   })
//   @ApiParam({ 
//     name: 'assignmentId', 
//     type: 'string', 
//     description: 'Assignment UUID',
//     example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
//   })
//   @ApiResponse({
//     status: 204,
//     description: 'Assignment deleted successfully'
//   })
//   @ApiBadRequestResponse({ description: 'Cannot delete assignment with submissions or unauthorized' })
//   @ApiNotFoundResponse({ description: 'Assignment not found' })
//   async deleteAssignment(
//     @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
//     @Request() req
//   ): Promise<void> {
//     const teacherId = req.user?.sub || req.user?.id;
    
//     if (!['teacher', 'hei_mentor', 'school_admin'].includes(req.user?.role)) {
//       throw new BadRequestException('Only teachers can delete assignments');
//     }
    
//     return this.assignmentsService.deleteAssignment(assignmentId, teacherId);
//   }

// }
