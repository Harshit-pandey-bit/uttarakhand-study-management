-- =========================================================
-- UK-GSMP Database Cleanup & Reset Script
-- WARNING: Running this script will permanently delete all tables,
-- views, enums, functions, and data. Use with caution.
-- =========================================================

-- 1. Drop all tables (CASCADE will automatically handle foreign key dependencies)
DROP TABLE IF EXISTS public.alternative_routes CASCADE;
DROP TABLE IF EXISTS public.announcement_views CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.assignment_submissions CASCADE;
DROP TABLE IF EXISTS public.assignment_templates CASCADE;
DROP TABLE IF EXISTS public.assignments CASCADE;
DROP TABLE IF EXISTS public.career_matches CASCADE;
DROP TABLE IF EXISTS public.career_pathways CASCADE;
DROP TABLE IF EXISTS public.careers CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_room_participants CASCADE;
DROP TABLE IF EXISTS public.chat_rooms CASCADE;
DROP TABLE IF EXISTS public.hei_admin_profiles CASCADE;
DROP TABLE IF EXISTS public.hei_mentor_profiles CASCADE;
DROP TABLE IF EXISTS public.heis CASCADE;
DROP TABLE IF EXISTS public.holland_questions CASCADE;
DROP TABLE IF EXISTS public.holland_results CASCADE;
DROP TABLE IF EXISTS public.inspirational_quotes CASCADE;
DROP TABLE IF EXISTS public.local_opportunities CASCADE;
DROP TABLE IF EXISTS public.mentor_availability CASCADE;
DROP TABLE IF EXISTS public.mentor_school_assignments CASCADE;
DROP TABLE IF EXISTS public.mentor_student_assignments CASCADE;
DROP TABLE IF EXISTS public.mentoring_sessions CASCADE;
DROP TABLE IF EXISTS public.message_reactions CASCADE;
DROP TABLE IF EXISTS public.ncert_chapters CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.pathway_stages CASCADE;
DROP TABLE IF EXISTS public.school_admin_profiles CASCADE;
DROP TABLE IF EXISTS public.schools CASCADE;
DROP TABLE IF EXISTS public.session_participants CASCADE;
DROP TABLE IF EXISTS public.student_activities CASCADE;
DROP TABLE IF EXISTS public.student_career_progress CASCADE;
DROP TABLE IF EXISTS public.student_dashboard_stats CASCADE;
DROP TABLE IF EXISTS public.student_favorites CASCADE;
DROP TABLE IF EXISTS public.student_profiles CASCADE;
DROP TABLE IF EXISTS public.student_projects CASCADE;
DROP TABLE IF EXISTS public.student_recent_activities CASCADE;
DROP TABLE IF EXISTS public.success_stories CASCADE;
DROP TABLE IF EXISTS public.teacher_profiles CASCADE;
DROP TABLE IF EXISTS public.test_results CASCADE;
DROP TABLE IF EXISTS public.tests CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.whatsapp_group_members CASCADE;
DROP TABLE IF EXISTS public.whatsapp_groups CASCADE;
DROP TABLE IF EXISTS public.whatsapp_questions CASCADE;

-- 2. Drop all custom types & enums
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.announcement_badge_type CASCADE;
DROP TYPE IF EXISTS public.announcement_author_role CASCADE;

-- 3. Drop custom database functions & triggers (if any were created)
-- Add any custom trigger functions if they exist:
-- DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
