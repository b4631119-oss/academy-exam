-- =============================================================
-- RLS HARDENING FIX (corrected)
--
-- The previous migration (20260826_rls_hardening.sql) used wrong
-- policy names and therefore NO policies were actually removed.
-- This migration uses the EXACT names from live pg_policies.
--
-- WHY public anon policies are unnecessary:
-- All student-facing DB operations go through Server Actions
-- that use createAdminClient() (service_role key), which
-- bypasses RLS entirely. Identity/ownership checks are done
-- server-side in the actions themselves.
--
-- Teacher policies using auth.uid() ownership checks are
-- CORRECT and MUST be preserved.
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- STUDENTS TABLE
-- Remove: public INSERT, SELECT, UPDATE, and qualified SELECT
-- Keep:   teacher ownership policy
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow public insert students" ON students;
DROP POLICY IF EXISTS "Allow public select students" ON students;
DROP POLICY IF EXISTS "Allow public update students" ON students;
DROP POLICY IF EXISTS "Students can view own room" ON students;

-- ─────────────────────────────────────────────────────────────
-- ROOMS TABLE
-- Remove: "Anyone can view rooms" (public SELECT true)
-- Keep:   teacher ownership policy
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can view rooms" ON rooms;

-- ─────────────────────────────────────────────────────────────
-- EXAMS TABLE
-- Remove: "Allow public select exams" (public SELECT true)
-- Keep:   teacher ownership policy
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow public select exams" ON exams;

-- ─────────────────────────────────────────────────────────────
-- QUESTIONS TABLE
-- Remove: "Allow public select questions" (public SELECT true)
-- Keep:   teacher ownership policy
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow public select questions" ON questions;

-- ─────────────────────────────────────────────────────────────
-- ANSWERS TABLE
-- Note: Previous migration already removed public policies.
-- Added DROP IF EXISTS here for safety (no-op if already gone).
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public insert answers" ON answers;
DROP POLICY IF EXISTS "Public select answers" ON answers;
DROP POLICY IF EXISTS "Public update answers" ON answers;

-- ─────────────────────────────────────────────────────────────
-- VERIFICATION QUERY (read-only, run after applying):
--
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
--
-- EXPECTED RESULT:
--   students  → teacher ownership only (no public USING(true))
--   rooms     → teacher ownership only (no "Anyone can view rooms")
--   exams     → teacher ownership only (no public SELECT true)
--   questions → teacher ownership only (no public SELECT true)
--   answers   → teacher ownership only (no public policies)
--   test_*    → no public anon policies
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- NOTES
-- ─────────────────────────────────────────────────────────────
-- Teacher ownership policies that MUST remain:
--
-- "Teacher full access to rooms"
--   ON rooms FOR ALL USING (auth.uid() = teacher_id);
--
-- "Teacher full access to students"
--   ON students FOR ALL USING (
--     auth.uid() IN (SELECT teacher_id FROM rooms WHERE id = room_id)
--   );
--
-- "Teacher full access to exams"
--   ON exams FOR ALL USING (
--     auth.uid() IN (SELECT teacher_id FROM rooms WHERE id = room_id)
--   );
--
-- "Teacher full access to questions"
--   ON questions FOR ALL USING (
--     auth.uid() IN (
--       SELECT teacher_id FROM rooms
--       WHERE id = (SELECT room_id FROM exams WHERE id = exam_id)
--     )
--   );
--
-- "Teacher full access to answers"
--   ON answers FOR ALL USING (
--     auth.uid() IN (
--       SELECT teacher_id FROM rooms
--       WHERE id = (SELECT room_id FROM students WHERE id = student_id)
--     )
--   );
-- =============================================================
