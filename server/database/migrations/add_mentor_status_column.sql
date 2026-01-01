-- =========================================================
-- ADD STATUS COLUMN TO HEI_MENTOR_PROFILES
-- Run this in Supabase SQL Editor
-- =========================================================

-- Add status column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'hei_mentor_profiles' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE hei_mentor_profiles 
        ADD COLUMN status VARCHAR(50) DEFAULT 'active';
        
        RAISE NOTICE 'Added status column to hei_mentor_profiles';
    ELSE
        RAISE NOTICE 'status column already exists';
    END IF;
END $$;

-- Add last_active column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'hei_mentor_profiles' 
        AND column_name = 'last_active'
    ) THEN
        ALTER TABLE hei_mentor_profiles 
        ADD COLUMN last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        RAISE NOTICE 'Added last_active column to hei_mentor_profiles';
    ELSE
        RAISE NOTICE 'last_active column already exists';
    END IF;
END $$;

-- Set default status for existing records
UPDATE hei_mentor_profiles 
SET status = 'active' 
WHERE status IS NULL;

SELECT 'Migration complete: status column added to hei_mentor_profiles' AS result;
