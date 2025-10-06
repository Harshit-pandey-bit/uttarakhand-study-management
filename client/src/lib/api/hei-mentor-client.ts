import type {
  HEIMentorDashboardData,
  MentoringSession,
  AssignedStudent,
  Assignment,
  AssignmentSubmission,
  ChatRoom,
  ChatMessage,
  School,
  SessionListResponse,
  StudentListResponse,
  AssignmentListResponse,
  ChatRoomListResponse,
  CreateSessionRequest,
  UpdateSessionRequest,
  CreateAssignmentRequest,
  GradeSubmissionRequest,
  SendMessageRequest,
  UpdateMentorProfileRequest,
  SessionFilters,
  StudentFilters,
  AssignmentFilters
} from '@/types/hei-mentor';

// ===== ESSENTIAL DUMMY DATA (CLEAN & MINIMAL) =====

const DUMMY_HEI_MENTOR_DASHBOARD: HEIMentorDashboardData = {
  mentor: {
    user: {
      id: 'mentor_001',
      email: 'dr.rajesh.kumar@iitdelhi.ac.in',
      name: 'Dr. Rajesh Kumar',
      phone_number: '+91-98765-43210',
      user_type: 'hei_mentor',
      profile_picture: undefined,
      is_active: true,
      onboarding_completed: true,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2025-10-01T14:30:00Z'
    },
    profile: {
      id: 'profile_001',
      user_id: 'mentor_001',
      hei_id: 'hei_001',
      employee_id: 'EMP2024001',
      designation: 'Assistant Professor',
      department: 'Computer Science and Engineering',
      expertise: ['Artificial Intelligence', 'Data Science', 'Python Programming'],
      qualification: 'Ph.D. in Computer Science from IIT Delhi',
      experience_years: 8,
      research_interests: ['Machine Learning', 'Educational Technology'],
      max_students: 30,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2025-09-28T16:45:00Z'
    },
    hei: {
      id: 'hei_001',
      name: 'Indian Institute of Technology Delhi',
      type: 'Technical University',
      location: 'New Delhi',
      district: 'South West Delhi',
      contact_email: 'info@iitdelhi.ac.in',
      is_active: true,
      created_at: '2020-01-01T00:00:00Z'
    }
  },
  stats: {
    // Student-focused actionable metrics
    assignedStudents: 24,
    studentsActiveThisWeek: 18,
    studentsCompletedHollandTest: 16,
    studentsNeedingAttention: 3,
    
    // Content & assignments that need action
    pendingSubmissions: 8,
    ungradedAssignments: 5,
    
    // Current session workload
    upcomingSessionsThisWeek: 4,
    
    // Career guidance progress
    studentsWithCareerPlans: 12,
    averageStudentProgress: 68
  },
  upcomingSessions: [
    {
      id: 'session_001',
      title: 'Introduction to Programming Concepts',
      description: 'Basic programming fundamentals for Class 11 students',
      mentor_id: 'mentor_001',
      session_date: '2025-10-06T10:00:00Z',
      duration: 60,
      session_type: 'group',
      subject: 'Computer Science',
      max_participants: 15,
      meeting_link: 'https://meet.google.com/abc-defg-hij',
      meeting_room: 'CS Lab - Room 101',
      status: 'scheduled',
      session_notes: undefined,
      created_at: '2025-10-01T09:00:00Z',
      updated_at: '2025-10-01T09:00:00Z',
      participants: [
        {
          id: 'participant_001',
          session_id: 'session_001',
          student_id: 'student_001',
          registration_date: '2025-10-01T10:00:00Z',
          attendance_status: 'registered',
          feedback: undefined,
          rating: undefined,
          student: {
            id: 'student_001',
            email: 'priya.sharma@student.gov.in',
            name: 'Priya Sharma',
            phone_number: '+91-98765-11111',
            user_type: 'student',
            profile_picture: undefined,
            is_active: true,
            onboarding_completed: true,
            created_at: '2025-08-01T10:00:00Z',
            updated_at: '2025-10-01T12:00:00Z'
          }
        }
      ]
    },
    {
      id: 'session_002',
      title: 'Career Guidance: AI and ML Paths',
      description: 'Exploring career opportunities in AI/ML',
      mentor_id: 'mentor_001',
      session_date: '2025-10-06T14:00:00Z',
      duration: 90,
      session_type: 'group',
      subject: 'Career Guidance',
      max_participants: 20,
      meeting_link: 'https://meet.google.com/xyz-abcd-efg',
      meeting_room: 'Virtual Session',
      status: 'scheduled',
      session_notes: undefined,
      created_at: '2025-10-02T11:00:00Z',
      updated_at: '2025-10-02T11:00:00Z',
      participants: []
    }
  ],
  recentActivity: [
    {
      id: 'activity_001',
      type: 'assignment_submitted',
      title: 'New Assignment Submission',
      description: 'Rahul Singh submitted "Basic Programming Concepts Assignment"',
      student_name: 'Rahul Singh',
      timestamp: '2025-10-05T16:30:00Z',
      is_read: false
    },
    {
      id: 'activity_002',
      type: 'session_completed',
      title: 'Session Completed',
      description: 'Successfully completed Python Basics session',
      student_name: undefined,
      timestamp: '2025-10-05T15:00:00Z',
      is_read: true
    },
    {
      id: 'activity_003',
      type: 'message_received',
      title: 'New Chat Message',
      description: 'Message received in Computer Science Study Group',
      student_name: undefined,
      timestamp: '2025-10-05T14:15:00Z',
      is_read: false
    }
  ],
  assignedSchools: [
    {
      id: 'school_001',
      name: 'Government Senior Secondary School, Rajouri',
      code: 'GSSS_RAJ_001',
      type: 'Government',
      location: 'Rajouri, Jammu & Kashmir',
      district: 'Rajouri',
      principal_name: 'Mrs. Sunita Devi',
      total_students: 450,
      is_active: true,
      created_at: '2020-04-01T00:00:00Z',
      studentsAssigned: 12,
      averageProgress: 78
    },
    {
      id: 'school_002',
      name: 'Government High School, Udhampur',
      code: 'GHS_UDP_002',
      type: 'Government',
      location: 'Udhampur, Jammu & Kashmir',
      district: 'Udhampur',
      principal_name: 'Mr. Rajesh Gupta',
      total_students: 320,
      is_active: true,
      created_at: '2019-06-01T00:00:00Z',
      studentsAssigned: 8,
      averageProgress: 82
    }
  ],
  pendingActions: [
    {
      id: 'action_001',
      type: 'grade_assignment',
      title: 'Assignments to Grade',
      description: '5 assignments are pending grading',
      priority: 'high',
      count: 5
    },
    {
      id: 'action_002',
      type: 'respond_message',
      title: 'Unread Messages',
      description: '8 unread messages in chat rooms',
      priority: 'medium',
      count: 8
    }
  ]
};

const DUMMY_ASSIGNED_STUDENTS: AssignedStudent[] = [
  {
    user: {
      id: 'student_001',
      email: 'priya.sharma@student.gov.in',
      name: 'Priya Sharma',
      phone_number: '+91-98765-11111',
      user_type: 'student',
      profile_picture: undefined,
      is_active: true,
      onboarding_completed: true,
      created_at: '2025-08-01T10:00:00Z',
      updated_at: '2025-10-01T12:00:00Z'
    },
    profile: {
      id: 'profile_student_001',
      user_id: 'student_001',
      school_id: 'school_001',
      class_level: '11',
      section: 'A',
      roll_number: '2025001',
      parent_name: 'Mr. Vijay Sharma',
      parent_contact: '+91-98765-11100',
      parent_email: 'vijay.sharma@gmail.com',
      date_of_birth: '2008-03-15',
      address: 'Village Rajouri, District Rajouri, J&K',
      emergency_contact: '+91-98765-11101',
      blood_group: 'B+',
      medical_conditions: undefined,
      interests: ['Computer Science', 'Mathematics'],
      career_aspirations: ['Software Engineer', 'Data Scientist'],
      learning_style: 'Visual',
      academic_performance: {
        currentGPA: 3.8,
        lastExamPercentage: 85
      },
      created_at: '2025-08-01T10:30:00Z',
      updated_at: '2025-10-01T12:30:00Z'
    },
    school: {
      id: 'school_001',
      name: 'Government Senior Secondary School, Rajouri',
      code: 'GSSS_RAJ_001',
      type: 'Government',
      location: 'Rajouri, Jammu & Kashmir',
      district: 'Rajouri',
      principal_name: 'Mrs. Sunita Devi',
      total_students: 450,
      is_active: true,
      created_at: '2020-04-01T00:00:00Z'
    },
    assignment: {
      id: 'assignment_001',
      mentor_id: 'mentor_001',
      student_id: 'student_001',
      assigned_by: 'admin_001',
      status: 'active',
      assigned_at: '2025-08-15T10:00:00Z',
      completed_at: undefined,
      notes: 'Excellent student with strong interest in programming',
      created_at: '2025-08-15T10:00:00Z',
      updated_at: '2025-09-01T14:00:00Z'
    },
    stats: {
      assignmentProgress: 85,
      completedAssignments: 12,
      totalAssignments: 15,
      sessionsAttended: 8,
      averageGrade: 87.5,
      lastActivity: '2025-10-05T16:30:00Z'
    },
    hollandResult: {
      id: 'holland_001',
      student_id: 'student_001',
      scores: {
        realistic: 65,
        investigative: 85,
        artistic: 45,
        social: 60,
        enterprising: 55,
        conventional: 50
      },
      personality_code: 'IRS',
      top_categories: ['Investigative', 'Realistic', 'Social'],
      matched_careers: ['Software Developer', 'Data Scientist'],
      completion_time: 1245,
      completed_at: '2025-08-20T14:30:00Z'
    }
  }
];

const DUMMY_SESSIONS: MentoringSession[] = [
  {
    id: 'session_001',
    title: 'Introduction to Programming Concepts',
    description: 'Basic programming fundamentals for Class 11 students',
    mentor_id: 'mentor_001',
    session_date: '2025-10-06T10:00:00Z',
    duration: 60,
    session_type: 'group',
    subject: 'Computer Science',
    max_participants: 15,
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    meeting_room: 'CS Lab - Room 101',
    status: 'scheduled',
    session_notes: undefined,
    created_at: '2025-10-01T09:00:00Z',
    updated_at: '2025-10-01T09:00:00Z'
  },
  {
    id: 'session_002',
    title: 'Career Guidance Session',
    description: 'Exploring career opportunities in AI/ML',
    mentor_id: 'mentor_001',
    session_date: '2025-10-04T15:00:00Z',
    duration: 75,
    session_type: 'group',
    subject: 'Career Guidance',
    max_participants: 12,
    meeting_link: undefined,
    meeting_room: 'Completed Session',
    status: 'completed',
    session_notes: 'Great participation from students.',
    created_at: '2025-09-30T12:00:00Z',
    updated_at: '2025-10-04T16:15:00Z'
  }
];

const DUMMY_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assignment_001',
    title: 'Basic Programming Concepts',
    description: 'Create simple programs using variables, loops, and conditional statements',
    subject: 'Computer Science',
    class_level: '11',
    teacher_id: 'mentor_001',
    due_date: '2025-10-10T23:59:59Z',
    total_marks: 100,
    difficulty: 'medium',
    ai_generated: false,
    ncert_chapter: 'Introduction to Programming',
    time_estimate: 120,
    submission_format: ['pdf', 'py'],
    questions: {
      totalQuestions: 3,
      questions: [
        {
          id: 1,
          question: 'Write a Python program to find the factorial of a number',
          marks: 40,
          type: 'coding'
        },
        {
          id: 2,
          question: 'Explain the difference between while and for loops',
          marks: 30,
          type: 'theory'
        },
        {
          id: 3,
          question: 'Create a program to check if a number is prime',
          marks: 30,
          type: 'coding'
        }
      ]
    },
    teacher_notes: 'Focus on proper indentation and logical thinking',
    ai_insights: undefined,
    is_active: true,
    created_at: '2025-09-28T10:00:00Z',
    updated_at: '2025-09-28T10:00:00Z'
  }
];

const DUMMY_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room_001',
    name: 'Computer Science Study Group',
    description: 'Discussion group for CS students',
    room_type: 'group',
    created_by: 'mentor_001',
    is_active: true,
    created_at: '2025-09-01T10:00:00Z',
    updated_at: '2025-10-05T18:30:00Z'
  },
  {
    id: 'room_002',
    name: 'Direct Chat: Priya Sharma',
    description: undefined,
    room_type: 'direct',
    created_by: 'mentor_001',
    is_active: true,
    created_at: '2025-08-20T14:30:00Z',
    updated_at: '2025-10-05T14:15:00Z'
  }
];

// ===== CLEAN API CLIENT IMPLEMENTATION =====

export const heiMentorAPI = {
  // ===== DASHBOARD =====
  getDashboard: async (): Promise<HEIMentorDashboardData> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return DUMMY_HEI_MENTOR_DASHBOARD;
  },

  // ===== PROFILE =====
  getMentorProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return DUMMY_HEI_MENTOR_DASHBOARD.mentor;
  },

  updateMentorProfile: async (data: UpdateMentorProfileRequest) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      ...DUMMY_HEI_MENTOR_DASHBOARD.mentor,
      profile: {
        ...DUMMY_HEI_MENTOR_DASHBOARD.mentor.profile,
        ...data,
        updated_at: new Date().toISOString()
      }
    };
  },

  // ===== SESSIONS =====
  getSessions: async (filters?: SessionFilters, page = 1, limit = 20): Promise<SessionListResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let filteredSessions = [...DUMMY_SESSIONS];
    
    if (filters?.status) {
      filteredSessions = filteredSessions.filter(s => s.status === filters.status);
    }
    
    if (filters?.subject) {
      filteredSessions = filteredSessions.filter(s => 
        s.subject?.toLowerCase().includes(filters.subject!.toLowerCase())
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedSessions = filteredSessions.slice(start, end);

    return {
      sessions: paginatedSessions,
      total: filteredSessions.length,
      page,
      limit,
      hasMore: end < filteredSessions.length
    };
  },

  getSessionById: async (sessionId: string): Promise<MentoringSession | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return DUMMY_SESSIONS.find(s => s.id === sessionId);
  },

  createSession: async (data: CreateSessionRequest): Promise<MentoringSession> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newSession: MentoringSession = {
      id: `session_${Date.now()}`,
      title: data.title,
      description: data.description,
      mentor_id: 'mentor_001',
      session_date: data.session_date,
      duration: data.duration,
      session_type: data.session_type,
      subject: data.subject,
      max_participants: data.max_participants || 1,
      meeting_link: undefined,
      meeting_room: data.meeting_room,
      status: 'scheduled',
      session_notes: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return newSession;
  },

  updateSession: async (sessionId: string, data: UpdateSessionRequest): Promise<MentoringSession> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const existingSession = DUMMY_SESSIONS.find(s => s.id === sessionId);
    if (!existingSession) {
      throw new Error('Session not found');
    }

    return {
      ...existingSession,
      ...data,
      updated_at: new Date().toISOString()
    };
  },

  // ===== STUDENTS =====
  getAssignedStudents: async (filters?: StudentFilters, page = 1, limit = 20): Promise<StudentListResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    let filteredStudents = [...DUMMY_ASSIGNED_STUDENTS];
    
    if (filters?.school_id) {
      filteredStudents = filteredStudents.filter(s => s.school.id === filters.school_id);
    }
    
    if (filters?.class_level) {
      filteredStudents = filteredStudents.filter(s => s.profile.class_level === filters.class_level);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedStudents = filteredStudents.slice(start, end);

    return {
      students: paginatedStudents,
      total: filteredStudents.length,
      page,
      limit,
      hasMore: end < filteredStudents.length
    };
  },

  getStudentById: async (studentId: string): Promise<AssignedStudent | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return DUMMY_ASSIGNED_STUDENTS.find(s => s.user.id === studentId);
  },

  // ===== ASSIGNMENTS =====
  getAssignments: async (filters?: AssignmentFilters, page = 1, limit = 20): Promise<AssignmentListResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let filteredAssignments = [...DUMMY_ASSIGNMENTS];
    
    if (filters?.subject) {
      filteredAssignments = filteredAssignments.filter(a => 
        a.subject.toLowerCase().includes(filters.subject!.toLowerCase())
      );
    }
    
    if (filters?.class_level) {
      filteredAssignments = filteredAssignments.filter(a => a.class_level === filters.class_level);
    }
    
    if (filters?.difficulty) {
      filteredAssignments = filteredAssignments.filter(a => a.difficulty === filters.difficulty);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedAssignments = filteredAssignments.slice(start, end);

    return {
      assignments: paginatedAssignments,
      total: filteredAssignments.length,
      page,
      limit,
      hasMore: end < filteredAssignments.length
    };
  },

  createAssignment: async (data: CreateAssignmentRequest): Promise<Assignment> => {
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const newAssignment: Assignment = {
      id: `assignment_${Date.now()}`,
      title: data.title,
      description: data.description,
      subject: data.subject,
      class_level: data.class_level,
      teacher_id: 'mentor_001',
      due_date: data.due_date,
      total_marks: data.total_marks,
      difficulty: data.difficulty,
      ai_generated: false,
      ncert_chapter: data.ncert_chapter,
      time_estimate: data.time_estimate,
      submission_format: data.submission_format,
      questions: data.questions,
      teacher_notes: data.teacher_notes,
      ai_insights: undefined,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return newAssignment;
  },

  // ===== SUBMISSIONS =====
  getSubmissions: async (assignmentId: string): Promise<AssignmentSubmission[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: 'submission_001',
        assignment_id: assignmentId,
        student_id: 'student_001',
        submission_files: ['solution.py', 'report.pdf'],
        submission_text: 'Please find my solutions attached.',
        submitted_at: '2025-10-05T16:30:00Z',
        score: 85,
        feedback: 'Good work! Consider optimizing the algorithm.',
        grade: 'B+',
        graded_by: 'mentor_001',
        graded_at: '2025-10-05T18:00:00Z',
        status: 'graded',
        file_urls: [
          'https://storage.example.com/submissions/solution.py',
          'https://storage.example.com/submissions/report.pdf'
        ],
        created_at: '2025-10-05T16:30:00Z',
        updated_at: '2025-10-05T18:00:00Z'
      }
    ];
  },

  gradeSubmission: async (submissionId: string, gradeData: GradeSubmissionRequest): Promise<AssignmentSubmission> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: submissionId,
      assignment_id: 'assignment_001',
      student_id: 'student_001',
      submission_files: ['solution.py'],
      submission_text: 'My solution',
      submitted_at: '2025-10-05T16:30:00Z',
      score: gradeData.score,
      feedback: gradeData.feedback,
      grade: gradeData.grade,
      graded_by: 'mentor_001',
      graded_at: new Date().toISOString(),
      status: 'graded',
      file_urls: ['https://storage.example.com/submissions/solution.py'],
      created_at: '2025-10-05T16:30:00Z',
      updated_at: new Date().toISOString()
    };
  },

  // ===== CHAT =====
  getChatRooms: async (): Promise<ChatRoomListResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const roomsWithDetails = DUMMY_CHAT_ROOMS.map(room => ({
      ...room,
      participants: [
        {
          id: 'participant_001',
          room_id: room.id,
          user_id: 'mentor_001',
          joined_at: room.created_at,
          last_seen: new Date().toISOString(),
          unread_count: 0,
          is_admin: true,
          is_active: true
        }
      ],
      lastMessage: {
        id: 'message_last',
        room_id: room.id,
        sender_id: 'student_001',
        content: 'Thank you for the explanation!',
        message_type: 'text' as const,
        file_url: undefined,
        reply_to_id: undefined,
        is_edited: false,
        is_deleted: false,
        created_at: '2025-10-05T14:30:00Z',
        updated_at: '2025-10-05T14:30:00Z'
      },
      unreadCount: Math.floor(Math.random() * 5)
    }));

    return {
      rooms: roomsWithDetails,
      total: roomsWithDetails.length
    };
  },

  getChatMessages: async (roomId: string): Promise<ChatMessage[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        id: 'message_001',
        room_id: roomId,
        sender_id: 'student_001',
        content: 'Hello Sir, I have a question about the assignment.',
        message_type: 'text',
        file_url: undefined,
        reply_to_id: undefined,
        is_edited: false,
        is_deleted: false,
        created_at: '2025-10-05T14:15:00Z',
        updated_at: '2025-10-05T14:15:00Z'
      },
      {
        id: 'message_002',
        room_id: roomId,
        sender_id: 'mentor_001',
        content: 'Sure! What specific part are you having trouble with?',
        message_type: 'text',
        file_url: undefined,
        reply_to_id: 'message_001',
        is_edited: false,
        is_deleted: false,
        created_at: '2025-10-05T14:20:00Z',
        updated_at: '2025-10-05T14:20:00Z'
      }
    ];
  },

  sendMessage: async (roomId: string, messageData: SendMessageRequest): Promise<ChatMessage> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: `message_${Date.now()}`,
      room_id: roomId,
      sender_id: 'mentor_001',
      content: messageData.content,
      message_type: messageData.message_type,
      file_url: messageData.file_url,
      reply_to_id: messageData.reply_to_id,
      is_edited: false,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  // ===== SCHOOLS =====
  getAssignedSchools: async (): Promise<School[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return DUMMY_HEI_MENTOR_DASHBOARD.assignedSchools.map(school => ({
      id: school.id,
      name: school.name,
      code: school.code,
      type: school.type,
      location: school.location,
      district: school.district,
      principal_name: school.principal_name,
      total_students: school.total_students,
      is_active: school.is_active,
      created_at: school.created_at
    }));
  },

  getSchoolById: async (schoolId: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const school = DUMMY_HEI_MENTOR_DASHBOARD.assignedSchools.find(s => s.id === schoolId);
    if (!school) return undefined;
    
    return {
      ...school,
      students: DUMMY_ASSIGNED_STUDENTS.filter(student => student.school.id === schoolId),
      recentActivity: [
        {
          type: 'assignment_submitted',
          student_name: 'Priya Sharma',
          description: 'Submitted programming assignment',
          timestamp: '2025-10-05T16:30:00Z'
        }
      ]
    };
  }
};

export default heiMentorAPI;
