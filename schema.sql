-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    teacher_id UUID NOT NULL, -- references auth.users in Supabase
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    title TEXT NOT NULL
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    text TEXT NOT NULL
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT NULL, -- NULL means pending review
    UNIQUE(student_id, question_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Simplified RLS policies for MVP (allow all authenticated operations for teacher, and public for student flow)
-- Teacher has full access if authenticated
CREATE POLICY "Teacher full access to rooms" ON rooms FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Teacher full access to students" ON students FOR ALL USING (auth.uid() IN (SELECT teacher_id FROM rooms WHERE id = room_id));
CREATE POLICY "Teacher full access to exams" ON exams FOR ALL USING (auth.uid() IN (SELECT teacher_id FROM rooms WHERE id = room_id));
CREATE POLICY "Teacher full access to questions" ON questions FOR ALL USING (auth.uid() IN (SELECT teacher_id FROM rooms WHERE id = (SELECT room_id FROM exams WHERE id = exam_id)));
CREATE POLICY "Teacher full access to answers" ON answers FOR ALL USING (auth.uid() IN (SELECT teacher_id FROM rooms WHERE id = (SELECT room_id FROM students WHERE id = student_id)));

-- Student read access (public based on room_id logic which is handled in the app server actions)
-- For MVP, we will use service_role or server-side queries that bypass RLS for student actions to simplify,
-- OR we can allow insert/select openly and filter in the app. Let's allow public inserts/selects for students.
CREATE POLICY "Public insert students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select students" ON students FOR SELECT USING (true);

CREATE POLICY "Public select rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public select exams" ON exams FOR SELECT USING (true);
CREATE POLICY "Public select questions" ON questions FOR SELECT USING (true);

CREATE POLICY "Public insert answers" ON answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select answers" ON answers FOR SELECT USING (true);
CREATE POLICY "Public update answers" ON answers FOR UPDATE USING (true); -- Optional: if students can update their answers

-- Note: In a production app, we would use more robust RLS or a custom JWT for students. 
-- For this MVP, most logic is handled via Server Actions in Next.js which can use a Supabase client without RLS if needed, or we rely on app-level filtering.
