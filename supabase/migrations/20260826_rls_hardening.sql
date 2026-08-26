-- =============================================================
-- RLS HARDENING: Remove all public anon policies with USING(true)/WITH CHECK(true)
-- Teacher policies (using auth.uid()) are kept as they are correct.
-- Student operations use admin client (service role) which bypasses RLS.
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- STUDENTS TABLE
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow public insert students" ON students;
DROP POLICY IF EXISTS "Allow public select students" ON students;
DROP POLICY IF EXISTS "Allow public update students" ON students;
DROP POLICY IF EXISTS "Students can view own room" ON students;

-- ─────────────────────────────────────────────────────────────
-- ROOMS TABLE
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can view rooms" ON rooms;

-- ─────────────────────────────────────────────────────────────
-- EXAMS TABLE
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow public select exams" ON exams;

-- ─────────────────────────────────────────────────────────────
-- QUESTIONS TABLE
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow public select questions" ON questions;

-- ─────────────────────────────────────────────────────────────
-- ANSWERS TABLE
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public insert answers" ON answers;
DROP POLICY IF EXISTS "Public select answers" ON answers;
DROP POLICY IF EXISTS "Public update answers" ON answers;

-- Teacher policies (already correct, using auth.uid() ownership checks)
-- are preserved. No replacement public policies are added.
-- All student-facing operations go through Server Actions that use
-- the admin client (service role) which bypasses RLS entirely.
