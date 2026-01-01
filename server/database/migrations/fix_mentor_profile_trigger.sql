-- =========================================================
-- FIX HEI MENTOR PROFILES - Run in Supabase SQL Editor
-- =========================================================

-- STEP 1: Create mentor_school_assignments table (for direct school tracking)
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
    UNIQUE (mentor_id, school_id, status)
);

CREATE INDEX IF NOT EXISTS idx_mentor_school_assignments_mentor_id ON mentor_school_assignments(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_school_assignments_school_id ON mentor_school_assignments(school_id);
CREATE INDEX IF NOT EXISTS idx_mentor_school_assignments_status ON mentor_school_assignments(status);

ALTER TABLE mentor_school_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_read_mentor_school_assignments" ON mentor_school_assignments;
CREATE POLICY "authenticated_read_mentor_school_assignments" ON mentor_school_assignments FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_insert_mentor_school_assignments" ON mentor_school_assignments;
CREATE POLICY "authenticated_insert_mentor_school_assignments" ON mentor_school_assignments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_update_mentor_school_assignments" ON mentor_school_assignments;
CREATE POLICY "authenticated_update_mentor_school_assignments" ON mentor_school_assignments FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_delete_mentor_school_assignments" ON mentor_school_assignments;
CREATE POLICY "authenticated_delete_mentor_school_assignments" ON mentor_school_assignments FOR DELETE USING (auth.role() = 'authenticated');

GRANT ALL ON mentor_school_assignments TO authenticated;
GRANT ALL ON mentor_school_assignments TO service_role;

-- STEP 2: Migrate existing HEI mentors to hei_mentor_profiles
-- This creates profile entries for users with role='hei_mentor' who don't have profiles yet
INSERT INTO hei_mentor_profiles (user_id, status, created_at, updated_at)
SELECT 
    u.id,
    'active',
    u.created_at,
    NOW()
FROM users u
WHERE u.role = 'hei_mentor'
AND NOT EXISTS (
    SELECT 1 FROM hei_mentor_profiles hmp WHERE hmp.user_id = u.id
)
ON CONFLICT DO NOTHING;

-- STEP 3: Add 'status' column to hei_mentor_profiles if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'hei_mentor_profiles' AND column_name = 'status'
    ) THEN
        ALTER TABLE hei_mentor_profiles ADD COLUMN status VARCHAR(50) DEFAULT 'active';
    END IF;
END $$;

-- STEP 4: Add 'last_active' column to hei_mentor_profiles if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'hei_mentor_profiles' AND column_name = 'last_active'
    ) THEN
        ALTER TABLE hei_mentor_profiles ADD COLUMN last_active TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- STEP 5: Verify - Check how many mentors and profiles exist now
SELECT 'Users with hei_mentor role:' as info, COUNT(*) as count FROM users WHERE role = 'hei_mentor'
UNION ALL
SELECT 'HEI Mentor Profiles:' as info, COUNT(*) as count FROM hei_mentor_profiles;
