-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This creates the mentor_student_links table for the mentor-mentee relationship

CREATE TABLE IF NOT EXISTS mentor_student_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(mentor_id, student_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_msl_mentor ON mentor_student_links(mentor_id);
CREATE INDEX IF NOT EXISTS idx_msl_student ON mentor_student_links(student_id);

-- Allow the service role full access (RLS is bypassed by service_role key anyway)
ALTER TABLE mentor_student_links ENABLE ROW LEVEL SECURITY;
