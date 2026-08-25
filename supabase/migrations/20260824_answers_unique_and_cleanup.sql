-- =============================================================
-- FIX: UNIQUE constraint on answers(student_id, question_id)
-- Prevents duplicate answers from concurrent requests
-- =============================================================

-- 1. First, remove any duplicate answers (keep the latest one per student+question)
DELETE FROM answers a
USING answers b
WHERE a.student_id = b.student_id
  AND a.question_id = b.question_id
  AND a.created_at < b.created_at;

-- 2. Add UNIQUE constraint
ALTER TABLE answers
ADD CONSTRAINT answers_student_question_unique
UNIQUE (student_id, question_id);

-- =============================================================
-- CLEANUP: Drop the exam_completed column migration (never applied, not needed)
-- The column does not exist in the DB and is never read by any code.
-- Exam completion is determined by saved answers in the answers table.
-- =============================================================
-- No DROP needed — column was never added.

-- =============================================================
-- NOTE: The old migration file supabase/migrations/20260814_add_exam_completed.sql
-- can be safely deleted. It was never applied to the database.
-- =============================================================
