-- =========================================================
-- ADD PRINCIPAL CONTACT COLUMNS TO SCHOOLS TABLE
-- Run this in Supabase SQL Editor
-- =========================================================

-- Add principal_contact column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'schools' 
        AND column_name = 'principal_contact'
    ) THEN
        ALTER TABLE schools ADD COLUMN principal_contact VARCHAR(50);
        RAISE NOTICE 'Added principal_contact column to schools';
    ELSE
        RAISE NOTICE 'principal_contact column already exists';
    END IF;
END $$;

-- Add principal_email column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'schools' 
        AND column_name = 'principal_email'
    ) THEN
        ALTER TABLE schools ADD COLUMN principal_email VARCHAR(255);
        RAISE NOTICE 'Added principal_email column to schools';
    ELSE
        RAISE NOTICE 'principal_email column already exists';
    END IF;
END $$;

-- Add principal_name column if it doesn't exist (should already exist based on your data)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'schools' 
        AND column_name = 'principal_name'
    ) THEN
        ALTER TABLE schools ADD COLUMN principal_name VARCHAR(255);
        RAISE NOTICE 'Added principal_name column to schools';
    ELSE
        RAISE NOTICE 'principal_name column already exists';
    END IF;
END $$;

-- Show current schools table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'schools' 
AND column_name LIKE 'principal%'
ORDER BY column_name;
