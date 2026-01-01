-- =========================================================
-- UTTARAKHAND GSMP DATABASE SCHEMA
-- Last Updated: 2026-01-01
-- This file is for reference only - DO NOT EXECUTE
-- =========================================================

CREATE TABLE public.alternative_routes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  pathway_id uuid,
  route_name character varying NOT NULL,
  description text,
  duration character varying,
  advantages ARRAY,
  challenges ARRAY,
  entry_requirements text,
  success_rate numeric,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT alternative_routes_pkey PRIMARY KEY (id),
  CONSTRAINT alternative_routes_pathway_id_fkey FOREIGN KEY (pathway_id) REFERENCES public.career_pathways(id)
);

CREATE TABLE public.announcement_views (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  announcement_id uuid NOT NULL,
  user_id uuid NOT NULL,
  viewed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT announcement_views_pkey PRIMARY KEY (id),
  CONSTRAINT announcement_views_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id),
  CONSTRAINT announcement_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.announcements (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text NOT NULL,
  badge_type USER-DEFINED NOT NULL DEFAULT 'general'::announcement_badge_type,
  badge_color character varying DEFAULT '#6366f1'::character varying,
  created_by uuid NOT NULL,
  author_role USER-DEFINED NOT NULL,
  target_audience ARRAY NOT NULL,
  priority character varying DEFAULT 'medium'::character varying,
  hei_id uuid,
  school_id uuid,
  class_level character varying,
  starts_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true,
  is_pinned boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT announcements_pkey PRIMARY KEY (id),
  CONSTRAINT announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id),
  CONSTRAINT announcements_hei_id_fkey FOREIGN KEY (hei_id) REFERENCES public.heis(id),
  CONSTRAINT announcements_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id)
);

CREATE TABLE public.assignment_submissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  assignment_id uuid,
  student_id uuid,
  submission_files ARRAY,
  submission_text text,
  submitted_at timestamp without time zone DEFAULT now(),
  score integer,
  feedback text,
  grade character varying,
  graded_by uuid,
  graded_at timestamp without time zone,
  status character varying DEFAULT 'submitted'::character varying,
  file_urls ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT assignment_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT assignment_submissions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id),
  CONSTRAINT assignment_submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id),
  CONSTRAINT assignment_submissions_graded_by_fkey FOREIGN KEY (graded_by) REFERENCES public.users(id)
);

CREATE TABLE public.assignment_templates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  subject character varying NOT NULL,
  class_level character varying NOT NULL,
  chapter character varying,
  difficulty character varying NOT NULL,
  question_types jsonb,
  template_data jsonb,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT assignment_templates_pkey PRIMARY KEY (id)
);

CREATE TABLE public.assignments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  subject character varying NOT NULL,
  class_level character varying NOT NULL,
  teacher_id uuid,
  due_date timestamp without time zone NOT NULL,
  total_marks integer DEFAULT 100,
  difficulty character varying DEFAULT 'medium'::character varying,
  ai_generated boolean DEFAULT false,
  ncert_chapter character varying,
  time_estimate integer,
  submission_format ARRAY DEFAULT ARRAY['pdf'::text],
  questions jsonb,
  teacher_notes text,
  ai_insights text,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT assignments_pkey PRIMARY KEY (id),
  CONSTRAINT assignments_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id)
);

CREATE TABLE public.career_matches (
  id integer NOT NULL DEFAULT nextval('career_matches_id_seq'::regclass),
  personality_code character varying NOT NULL,
  careers jsonb NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT career_matches_pkey PRIMARY KEY (id)
);

CREATE TABLE public.career_pathways (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  career_id uuid,
  estimated_duration character varying NOT NULL DEFAULT '4-6 years'::character varying,
  difficulty_level character varying NOT NULL DEFAULT 'intermediate'::character varying,
  description text,
  requirements text,
  career_prospects text,
  salary_range character varying,
  growth_rate character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT career_pathways_pkey PRIMARY KEY (id),
  CONSTRAINT career_pathways_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id)
);

CREATE TABLE public.careers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  emoji character varying,
  description text,
  category character varying,
  holland_codes ARRAY NOT NULL,
  salary_range character varying,
  demand_level character varying,
  education_level character varying,
  skills ARRAY,
  work_environment text,
  typical_day text,
  pros ARRAY,
  cons ARRAY,
  famous_persons ARRAY,
  pathway text,
  inspiring_fact text,
  local_connection text,
  next_steps ARRAY,
  is_featured boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT careers_pkey PRIMARY KEY (id)
);

CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  room_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  message_type character varying DEFAULT 'text'::character varying,
  file_url character varying,
  reply_to_id uuid,
  is_edited boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
  CONSTRAINT chat_messages_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.chat_rooms(id),
  CONSTRAINT chat_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id),
  CONSTRAINT chat_messages_reply_to_id_fkey FOREIGN KEY (reply_to_id) REFERENCES public.chat_messages(id)
);

CREATE TABLE public.chat_room_participants (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  room_id uuid NOT NULL,
  user_id uuid NOT NULL,
  joined_at timestamp without time zone DEFAULT now(),
  last_seen timestamp without time zone DEFAULT now(),
  unread_count integer DEFAULT 0,
  is_admin boolean DEFAULT false,
  is_active boolean DEFAULT true,
  CONSTRAINT chat_room_participants_pkey PRIMARY KEY (id),
  CONSTRAINT chat_room_participants_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.chat_rooms(id),
  CONSTRAINT chat_room_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.chat_rooms (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  room_type character varying DEFAULT 'group'::character varying,
  created_by uuid NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT chat_rooms_pkey PRIMARY KEY (id),
  CONSTRAINT chat_rooms_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);

CREATE TABLE public.hei_admin_profiles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  hei_id uuid,
  employee_id character varying,
  designation character varying,
  department character varying,
  responsibilities ARRAY,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT hei_admin_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT hei_admin_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT hei_admin_profiles_hei_id_fkey FOREIGN KEY (hei_id) REFERENCES public.heis(id)
);

CREATE TABLE public.hei_mentor_profiles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  hei_id uuid,
  employee_id character varying,
  designation character varying,
  department character varying,
  expertise ARRAY,
  qualification character varying,
  experience_years integer,
  research_interests ARRAY,
  max_students integer DEFAULT 30,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT hei_mentor_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT hei_mentor_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT hei_mentor_profiles_hei_id_fkey FOREIGN KEY (hei_id) REFERENCES public.heis(id)
);

CREATE TABLE public.heis (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  type character varying,
  location character varying,
  district character varying,
  contact_email character varying,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT heis_pkey PRIMARY KEY (id)
);

CREATE TABLE public.holland_questions (
  id integer NOT NULL,
  text text NOT NULL,
  category character varying NOT NULL,
  options jsonb NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT holland_questions_pkey PRIMARY KEY (id)
);

CREATE TABLE public.holland_results (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid UNIQUE,
  scores jsonb NOT NULL,
  personality_code character varying NOT NULL,
  top_categories ARRAY NOT NULL,
  matched_careers ARRAY NOT NULL,
  completion_time integer NOT NULL,
  completed_at timestamp without time zone DEFAULT now(),
  CONSTRAINT holland_results_pkey PRIMARY KEY (id),
  CONSTRAINT holland_results_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);

CREATE TABLE public.inspirational_quotes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  quote_text text NOT NULL,
  author character varying NOT NULL,
  category character varying,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT inspirational_quotes_pkey PRIMARY KEY (id)
);

CREATE TABLE public.local_opportunities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  career_id uuid,
  opportunity_type character varying NOT NULL,
  institution character varying NOT NULL,
  location character varying NOT NULL,
  programs ARRAY NOT NULL,
  admission_criteria text,
  website character varying,
  contact character varying,
  fees_range character varying,
  placement_rate numeric,
  accreditation character varying,
  established_year integer,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT local_opportunities_pkey PRIMARY KEY (id),
  CONSTRAINT local_opportunities_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id)
);

CREATE TABLE public.mentor_availability (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  mentor_id uuid NOT NULL,
  day_of_week integer NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT mentor_availability_pkey PRIMARY KEY (id),
  CONSTRAINT mentor_availability_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.hei_mentor_profiles(id)
);

-- NOTE: mentor_school_assignments.mentor_id has NO foreign key constraint
-- It can store either hei_mentor_profiles.id OR users.id
CREATE TABLE public.mentor_school_assignments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  mentor_id uuid NOT NULL,
  school_id uuid NOT NULL,
  assigned_by uuid,
  status character varying DEFAULT 'active'::character varying,
  assigned_at timestamp with time zone DEFAULT now(),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT mentor_school_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT mentor_school_assignments_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id),
  CONSTRAINT mentor_school_assignments_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id)
);

CREATE TABLE public.mentor_student_assignments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  mentor_id uuid NOT NULL,
  student_id uuid NOT NULL,
  assigned_by uuid,
  status character varying DEFAULT 'active'::character varying,
  assigned_at timestamp without time zone DEFAULT now(),
  completed_at timestamp without time zone,
  notes text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT mentor_student_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT mentor_student_assignments_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.hei_mentor_profiles(id),
  CONSTRAINT mentor_student_assignments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id),
  CONSTRAINT mentor_student_assignments_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id)
);

CREATE TABLE public.mentoring_sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  mentor_id uuid,
  session_date timestamp without time zone NOT NULL,
  duration integer DEFAULT 60,
  session_type character varying NOT NULL,
  subject character varying,
  max_participants integer DEFAULT 1,
  meeting_link character varying,
  meeting_room character varying,
  status character varying DEFAULT 'scheduled'::character varying,
  session_notes text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT mentoring_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT mentoring_sessions_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.users(id)
);

CREATE TABLE public.message_reactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  message_id uuid NOT NULL,
  user_id uuid NOT NULL,
  emoji character varying NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT message_reactions_pkey PRIMARY KEY (id),
  CONSTRAINT message_reactions_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.chat_messages(id),
  CONSTRAINT message_reactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.ncert_chapters (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  subject character varying NOT NULL,
  class_level character varying NOT NULL,
  chapter_number integer NOT NULL,
  chapter_title character varying NOT NULL,
  topics ARRAY,
  learning_objectives ARRAY,
  keywords ARRAY,
  difficulty_progression jsonb,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT ncert_chapters_pkey PRIMARY KEY (id)
);

CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  title character varying NOT NULL,
  message text NOT NULL,
  notification_type character varying NOT NULL,
  resource_id character varying,
  is_read boolean DEFAULT false,
  priority character varying DEFAULT 'medium'::character varying,
  action_url character varying,
  expires_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.pathway_stages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  pathway_id uuid,
  stage_number integer NOT NULL,
  title character varying NOT NULL,
  duration character varying,
  description text,
  requirements ARRAY,
  key_subjects ARRAY,
  examinations ARRAY,
  skills_to_gain ARRAY,
  next_options ARRAY,
  is_optional boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT pathway_stages_pkey PRIMARY KEY (id),
  CONSTRAINT pathway_stages_pathway_id_fkey FOREIGN KEY (pathway_id) REFERENCES public.career_pathways(id)
);

CREATE TABLE public.school_admin_profiles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  school_id uuid,
  employee_id character varying,
  designation character varying,
  responsibilities ARRAY,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT school_admin_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT school_admin_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT school_admin_profiles_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id)
);

CREATE TABLE public.schools (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  code character varying NOT NULL,
  type character varying,
  location character varying,
  district character varying,
  principal_name character varying,
  total_students integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT schools_pkey PRIMARY KEY (id)
);

CREATE TABLE public.session_participants (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  session_id uuid,
  student_id uuid,
  registration_date timestamp without time zone DEFAULT now(),
  attendance_status character varying DEFAULT 'registered'::character varying,
  feedback text,
  rating integer,
  CONSTRAINT session_participants_pkey PRIMARY KEY (id),
  CONSTRAINT session_participants_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.mentoring_sessions(id),
  CONSTRAINT session_participants_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);

CREATE TABLE public.student_activities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid,
  activity_type character varying NOT NULL,
  resource_id character varying NOT NULL,
  metadata jsonb,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT student_activities_pkey PRIMARY KEY (id),
  CONSTRAINT student_activities_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);

CREATE TABLE public.student_career_progress (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid,
  careers_explored integer DEFAULT 0,
  pathways_viewed integer DEFAULT 0,
  stories_read integer DEFAULT 0,
  total_progress numeric DEFAULT 0.0,
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT student_career_progress_pkey PRIMARY KEY (id),
  CONSTRAINT student_career_progress_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);

CREATE TABLE public.student_dashboard_stats (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid UNIQUE,
  completed_assignments integer DEFAULT 0,
  total_assignments integer DEFAULT 0,
  upcoming_tests integer DEFAULT 0,
  mentoring_sessions_attended integer DEFAULT 0,
  total_mentoring_sessions integer DEFAULT 0,
  average_assignment_score numeric DEFAULT 0,
  average_test_score numeric DEFAULT 0,
  career_exploration_progress numeric DEFAULT 0,
  last_updated timestamp without time zone DEFAULT now(),
  CONSTRAINT student_dashboard_stats_pkey PRIMARY KEY (id),
  CONSTRAINT student_dashboard_stats_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);

CREATE TABLE public.student_favorites (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid,
  career_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT student_favorites_pkey PRIMARY KEY (id),
  CONSTRAINT student_favorites_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id),
  CONSTRAINT student_favorites_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id)
);

CREATE TABLE public.student_profiles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  school_id uuid,
  class_level character varying,
  career_aspiration character varying,
  parent_contact character varying,
  address text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT student_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT student_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT student_profiles_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id)
);

CREATE TABLE public.student_projects (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid,
  title character varying NOT NULL,
  description text,
  project_type character varying,
  subject character varying,
  start_date date,
  end_date date,
  status character varying DEFAULT 'in-progress'::character varying,
  skills_used ARRAY,
  technologies ARRAY,
  project_url character varying,
  repository_url character varying,
  achievements ARRAY,
  mentor_feedback text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT student_projects_pkey PRIMARY KEY (id),
  CONSTRAINT student_projects_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);

CREATE TABLE public.student_recent_activities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid,
  activity_type character varying NOT NULL,
  activity_title character varying NOT NULL,
  activity_description text,
  resource_id character varying,
  status character varying NOT NULL,
  activity_date timestamp without time zone NOT NULL,
  metadata jsonb,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT student_recent_activities_pkey PRIMARY KEY (id),
  CONSTRAINT student_recent_activities_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);

CREATE TABLE public.success_stories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  career_id uuid,
  person_name character varying NOT NULL,
  location character varying,
  background text NOT NULL,
  journey text NOT NULL,
  inspiration text,
  role_title character varying,
  achievement text,
  quote text,
  is_featured boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT success_stories_pkey PRIMARY KEY (id),
  CONSTRAINT success_stories_career_id_fkey FOREIGN KEY (career_id) REFERENCES public.careers(id)
);

CREATE TABLE public.teacher_profiles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  school_id uuid,
  employee_id character varying,
  subjects ARRAY,
  classes ARRAY,
  qualification character varying,
  experience_years integer,
  joined_date date,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT teacher_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT teacher_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT teacher_profiles_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id)
);

CREATE TABLE public.test_results (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  test_id uuid,
  student_id uuid,
  score integer,
  percentage numeric,
  grade character varying,
  completed_at timestamp without time zone,
  time_taken integer,
  answers jsonb,
  feedback text,
  CONSTRAINT test_results_pkey PRIMARY KEY (id),
  CONSTRAINT test_results_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id),
  CONSTRAINT test_results_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);

CREATE TABLE public.tests (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  subject character varying NOT NULL,
  class_level character varying NOT NULL,
  teacher_id uuid,
  test_date timestamp without time zone NOT NULL,
  duration integer DEFAULT 90,
  total_marks integer DEFAULT 100,
  instructions text,
  test_type character varying DEFAULT 'exam'::character varying,
  questions jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT tests_pkey PRIMARY KEY (id),
  CONSTRAINT tests_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id)
);

CREATE TABLE public.users (
  id uuid NOT NULL,
  email character varying NOT NULL UNIQUE,
  full_name character varying NOT NULL,
  phone character varying,
  avatar_url text,
  role USER-DEFINED NOT NULL,
  is_active boolean DEFAULT true,
  onboarding_completed boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE public.whatsapp_group_members (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  group_id uuid NOT NULL,
  student_id uuid NOT NULL,
  joined_at timestamp without time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  unread_count integer DEFAULT 0,
  is_pinned boolean DEFAULT false,
  last_activity timestamp without time zone DEFAULT now(),
  CONSTRAINT whatsapp_group_members_pkey PRIMARY KEY (id),
  CONSTRAINT whatsapp_group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.whatsapp_groups(id),
  CONSTRAINT whatsapp_group_members_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);

CREATE TABLE public.whatsapp_groups (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  subject character varying,
  description text,
  member_count integer DEFAULT 0,
  max_members integer DEFAULT 256,
  whatsapp_link character varying,
  mentor_id uuid,
  active_hours character varying DEFAULT '9:00 AM - 6:00 PM'::character varying,
  guidelines ARRAY,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT whatsapp_groups_pkey PRIMARY KEY (id),
  CONSTRAINT whatsapp_groups_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.hei_mentor_profiles(id)
);

CREATE TABLE public.whatsapp_questions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  group_id uuid NOT NULL,
  student_id uuid NOT NULL,
  question text NOT NULL,
  subject character varying,
  answered_by uuid,
  answer text,
  upvotes integer DEFAULT 0,
  is_resolved boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT whatsapp_questions_pkey PRIMARY KEY (id),
  CONSTRAINT whatsapp_questions_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.whatsapp_groups(id),
  CONSTRAINT whatsapp_questions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id),
  CONSTRAINT whatsapp_questions_answered_by_fkey FOREIGN KEY (answered_by) REFERENCES public.users(id)
);
