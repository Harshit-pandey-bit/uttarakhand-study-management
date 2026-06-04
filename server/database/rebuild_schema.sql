-- ============================================================================
-- UTTARAKHAND GOVERNMENT SCHOOL MENTORING PLATFORM (UK-GSMP)
-- PostgreSQL / Supabase Rebuild Schema Script
-- Version: 2.0.0 (Production-Ready, Strictly Typed)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS & ENUMS
-- ----------------------------------------------------------------------------

-- Enable the UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing types if they exist to prevent duplication
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.session_status CASCADE;

-- Create user_role enum
CREATE TYPE public.user_role AS ENUM (
  'STUDENT',
  'TEACHER',
  'HEI_MENTOR',
  'SCHOOL_ADMIN',
  'HEI_ADMIN'
);

-- Create session_status enum
CREATE TYPE public.session_status AS ENUM (
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED'
);

-- ----------------------------------------------------------------------------
-- 2. TABLES & RELATIONSHIPS
-- ----------------------------------------------------------------------------

-- A. Schools Table
CREATE TABLE public.schools (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  district text NOT NULL,
  type text NOT NULL, -- e.g., 'GOVERNMENT', 'HEI'
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT schools_pkey PRIMARY KEY (id),
  CONSTRAINT schools_name_key UNIQUE (name)
);

-- B. Extended Users Table (Maps to Supabase auth.users)
CREATE TABLE public.ext_users (
  id uuid NOT NULL,
  role public.user_role NOT NULL,
  full_name text NOT NULL,
  school_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT ext_users_pkey PRIMARY KEY (id),
  CONSTRAINT ext_users_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT ext_users_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools (id) ON DELETE SET NULL
);

-- C. Holland Assessments Table
CREATE TABLE public.holland_assessments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL,
  r_score integer NOT NULL DEFAULT 0,
  i_score integer NOT NULL DEFAULT 0,
  a_score integer NOT NULL DEFAULT 0,
  s_score integer NOT NULL DEFAULT 0,
  e_score integer NOT NULL DEFAULT 0,
  c_score integer NOT NULL DEFAULT 0,
  top_careers jsonb, -- Calculated career matches
  completed_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT holland_assessments_pkey PRIMARY KEY (id),
  CONSTRAINT holland_assessments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.ext_users (id) ON DELETE CASCADE
);

-- D. Mentoring Sessions Table
CREATE TABLE public.mentoring_sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  mentor_id uuid NOT NULL,
  student_id uuid NOT NULL,
  scheduled_time timestamp with time zone NOT NULL,
  google_meet_link text,
  status public.session_status NOT NULL DEFAULT 'SCHEDULED'::public.session_status,
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT mentoring_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT mentoring_sessions_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.ext_users (id) ON DELETE RESTRICT,
  CONSTRAINT mentoring_sessions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.ext_users (id) ON DELETE CASCADE
);

-- E. Assignments Table
CREATE TABLE public.assignments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  creator_id uuid NOT NULL,
  title text NOT NULL,
  ncert_reference text,
  marking_criteria text,
  due_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT assignments_pkey PRIMARY KEY (id),
  CONSTRAINT assignments_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.ext_users (id) ON DELETE CASCADE
);

-- F. Submissions Table
CREATE TABLE public.submissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  assignment_id uuid NOT NULL,
  student_id uuid NOT NULL,
  file_path text NOT NULL, -- Asset path for tracking uploads
  grade text, -- e.g., 'A+', 'B'
  percentage numeric,
  submitted_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT submissions_pkey PRIMARY KEY (id),
  CONSTRAINT submissions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments (id) ON DELETE CASCADE,
  CONSTRAINT submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.ext_users (id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 3. INTEGRITY & PERFORMANCE (INDEXES)
-- ----------------------------------------------------------------------------

-- Indexes on foreign keys for fast relational join performance
CREATE INDEX IF NOT EXISTS idx_ext_users_school_id ON public.ext_users(school_id);
CREATE INDEX IF NOT EXISTS idx_holland_assessments_student_id ON public.holland_assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_mentoring_sessions_mentor_id ON public.mentoring_sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentoring_sessions_student_id ON public.mentoring_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_creator_id ON public.assignments(creator_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON public.submissions(student_id);

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) ACTIVATION
-- ----------------------------------------------------------------------------

-- Enable Row Level Security (RLS) on all tables to secure Supabase API access
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ext_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holland_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
