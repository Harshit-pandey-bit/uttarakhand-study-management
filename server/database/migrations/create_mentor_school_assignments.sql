-- =========================================================
-- MENTOR SCHOOL ASSIGNMENTS TABLE
-- Run this in your Supabase SQL Editor to enable direct
-- mentor-school assignment tracking
-- =========================================================

-- Create the mentor_school_assignments table
CREATE TABLE IF NOT EXISTS mentor_school_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID NOT NULL,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate active assignments
    UNIQUE (mentor_id, school_id, status)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_mentor_school_assignments_mentor_id 
    ON mentor_school_assignments(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_school_assignments_school_id 
    ON mentor_school_assignments(school_id);
CREATE INDEX IF NOT EXISTS idx_mentor_school_assignments_status 
    ON mentor_school_assignments(status);

-- Enable Row Level Security (RLS)
ALTER TABLE mentor_school_assignments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read
CREATE POLICY "Allow authenticated read" ON mentor_school_assignments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON mentor_school_assignments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON mentor_school_assignments
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON mentor_school_assignments
    FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON mentor_school_assignments TO authenticated;
GRANT ALL ON mentor_school_assignments TO service_role;
