/**
 * Playwright global setup — seeds test data via Supabase admin client
 * and saves browser storage states for real auth.
 */
import { createClient } from '@supabase/supabase-js';
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TEACHER_EMAIL = 'teacher@test.com';
const TEACHER_PASSWORD = 'teacher123';
const STUDENT_NAME = 'Test Student';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || '';

const DATA_FILE = path.join(__dirname, 'test-data.json');
const TEACHER_AUTH = path.join(__dirname, 'teacher-auth.json');
const STUDENT_AUTH = path.join(__dirname, 'student-auth.json');

export default async function globalSetup() {
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  await cleanupTestData(admin);

  const browser = await chromium.launch();

  // ── Teacher login ──────────────────────────────────
  const teacherCtx = await browser.newContext();
  const teacherPage = await teacherCtx.newPage();
  await teacherPage.goto(`${BASE_URL}/teacher/login`);
  await teacherPage.waitForLoadState('domcontentloaded');
  await teacherPage.fill('#email', TEACHER_EMAIL);
  await teacherPage.fill('#password', TEACHER_PASSWORD);
  await teacherPage.click('button[type="submit"]');
  await teacherPage.waitForURL(/\/teacher\/dashboard/, { timeout: 30000 });

  const { data: teacherAuth } = await admin.auth.admin.listUsers();
  const teacherUser = teacherAuth?.users?.find((u) => u.email === TEACHER_EMAIL);
  if (!teacherUser) throw new Error('Teacher user not found');
  const teacherId = teacherUser.id;

  await teacherCtx.storageState({ path: TEACHER_AUTH });
  console.log('✅ Teacher authenticated');

  // ── Seed data ──────────────────────────────────────
  const roomCode = `E2E${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const { data: room, error: roomErr } = await admin
    .from('rooms')
    .insert([{ teacher_id: teacherId, name: `E2E Test Room ${Date.now()}`, code: roomCode }])
    .select()
    .single();
  if (roomErr) throw new Error(`Room: ${roomErr.message}`);

  const { data: exam, error: examErr } = await admin
    .from('exams')
    .insert([{ room_id: room.id, title: `E2E Test Exam ${Date.now()}` }])
    .select()
    .single();
  if (examErr) throw new Error(`Exam: ${examErr.message}`);

  for (const text of ['What is 2+2?', 'Explain the concept of gravity.', 'Choose the correct option.']) {
    const { error } = await admin.from('questions').insert([{ exam_id: exam.id, text }]);
    if (error) throw new Error(`Exam question: ${error.message}`);
  }

  const { data: testRow, error: testErr } = await admin
    .from('tests')
    .insert([{
      room_id: room.id,
      teacher_id: teacherId,
      title: `E2E Test Quiz ${Date.now()}`,
      description: 'E2E test description',
      status: 'draft',
    }])
    .select()
    .single();
  if (testErr) throw new Error(`Test: ${testErr.message}`);

  const testQuestions = [
    {
      text: 'Q1: What is the capital of France?',
      options: [
        { text: 'London', is_correct: false },
        { text: 'Paris', is_correct: true },
        { text: 'Berlin', is_correct: false },
        { text: 'Madrid', is_correct: false },
      ],
    },
    {
      text: 'Q2: What is 5*5?',
      options: [
        { text: '20', is_correct: false },
        { text: '25', is_correct: true },
        { text: '30', is_correct: false },
        { text: '35', is_correct: false },
      ],
    },
    {
      text: 'Q3: Choose the correct statement.',
      options: [
        { text: 'Water boils at 100°C', is_correct: true },
        { text: 'Water freezes at 100°C', is_correct: false },
        { text: 'Water is not H2O', is_correct: false },
        { text: 'Water is a metal', is_correct: false },
      ],
    },
  ];

  for (let qi = 0; qi < testQuestions.length; qi++) {
    const q = testQuestions[qi];
    const { data: qRow, error: qErr } = await admin
      .from('test_questions')
      .insert([{
        test_id: testRow.id,
        question_text: q.text,
        position: qi + 1,
        time_limit_seconds: 60,
        points: 20,
      }])
      .select()
      .single();
    if (qErr) throw new Error(`Test question: ${qErr.message}`);

    for (let oi = 0; oi < q.options.length; oi++) {
      const opt = q.options[oi];
      const { error: oErr } = await admin.from('test_options').insert([{
        question_id: qRow.id,
        option_text: opt.text,
        position: oi + 1,
        is_correct: opt.is_correct,
      }]);
      if (oErr) throw new Error(`Test option: ${oErr.message}`);
    }
  }
  console.log('✅ Seed data created');

  // ── Student: create via admin, set JWT cookie ──────
  const { data: student, error: studentErr } = await admin
    .from('students')
    .insert([{ name: STUDENT_NAME, room_id: room.id }])
    .select()
    .single();
  if (studentErr) throw new Error(`Student: ${studentErr.message}`);

  // Create a browser context and set the JWT cookie directly
  const studentCtx = await browser.newContext();
  const studentPage = await studentCtx.newPage();

  // Sign JWT token matching the app's jose-based format
  const secret = new TextEncoder().encode(JWT_SECRET);
  const studentToken = await new SignJWT({ studentId: student.id, roomId: room.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  // Navigate to student domain first to set cookie
  await studentPage.goto(`${BASE_URL}/student/enter`);
  await studentPage.waitForLoadState('domcontentloaded');

  // Set the cookie
  await studentCtx.addCookies([{
    name: 'studentToken',
    value: studentToken,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
  }]);

  // Verify the cookie works by navigating to the room
  await studentPage.goto(`${BASE_URL}/student/rooms/${room.id}`);
  await studentPage.waitForLoadState('domcontentloaded');

  // If redirected back to enter, the JWT secret is wrong — fall back to browser login
  let usedFallback = false;
  if (studentPage.url().includes('/student/enter')) {
    console.log('⚠️  JWT cookie did not work, falling back to browser login...');
    usedFallback = true;
    studentPage.on('dialog', (dialog) => dialog.accept());
    await studentPage.goto(`${BASE_URL}/student/enter`);
    await studentPage.waitForLoadState('domcontentloaded');
    await studentPage.fill('#name', `${STUDENT_NAME} E2E`);
    await studentPage.fill('#code', roomCode);
    await studentPage.click('button[type="submit"]');
    await studentPage.waitForURL(/\/student\/rooms\/[0-9a-f]{8}-/, { timeout: 30000 });
  }

  await studentCtx.storageState({ path: STUDENT_AUTH });
  console.log('✅ Student authenticated');

  // ── Resolve actual student ID ───────────────────────
  // Use a fresh browser to verify which student the auth resolves to
  const verifyCtx = await browser.newContext({ storageState: STUDENT_AUTH });
  const verifyPage = await verifyCtx.newPage();
  await verifyPage.goto(`${BASE_URL}/student/rooms/${room.id}`);
  await verifyPage.waitForLoadState('domcontentloaded');
  await verifyPage.waitForTimeout(3000);

  // Use the admin client to find the student by looking at the JWT payload
  // The student page loaded → use the student from DB that matches
  let actualStudentId = student.id;
  const url = verifyPage.url();
  if (url.includes('/student/enter')) {
    // JWT didn't work — student was created by browser login
    // Find the most recently created student in this room
    const { data: students } = await admin
      .from('students')
      .select('id, name, created_at')
      .eq('room_id', room.id)
      .order('created_at', { ascending: false });
    if (students && students.length > 0) {
      // Use the student that is NOT the admin-inserted one
      const browserStudent = students.find(s => s.id !== student.id) || students[0];
      actualStudentId = browserStudent.id;
      // Remove the original admin-created student
      if (student.id !== browserStudent.id) {
        await admin.from('students').delete().eq('id', student.id);
      }
    }
  }
  console.log(`✅ Using student ID: ${actualStudentId}`);

  await verifyPage.close();
  await verifyCtx.close();
  await studentPage.close();

  // ── Test session via admin ──────────────────────────
  const { data: session, error: sessErr } = await admin
    .from('test_sessions')
    .insert([{
      room_id: room.id,
      test_id: testRow.id,
      status: 'running',
      started_at: new Date().toISOString(),
    }])
    .select()
    .single();
  if (sessErr) throw new Error(`Session: ${sessErr.message}`);

  await admin.from('test_participants').insert([{
    session_id: session.id,
    student_id: actualStudentId,
  }]);
  console.log('✅ Test session + participant created');

  await teacherCtx.close();
  await browser.close();

  const testData = {
    roomId: room.id,
    roomCode,
    examId: exam.id,
    testId: testRow.id,
    testTitle: testRow.title,
    sessionId: session.id,
    studentId: actualStudentId,
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(testData, null, 2));
  console.log('\n✅ E2E global setup complete\n');
}

async function cleanupTestData(admin: ReturnType<typeof createClient>) {
  try {
    const { data: oldRooms } = await admin
      .from('rooms')
      .select('id')
      .like('name', 'E2E%');
    if (!oldRooms || oldRooms.length === 0) return;

    const roomIds = oldRooms.map((r) => r.id);
    const { data: oldExams } = await admin.from('exams').select('id').in('room_id', roomIds);
    if (oldExams) {
      const examIds = oldExams.map((e) => e.id);
      const { data: qRows } = await admin.from('questions').select('id').in('exam_id', examIds);
      if (qRows && qRows.length > 0) {
        await admin.from('answers').delete().in('question_id', qRows.map((q) => q.id));
      }
      await admin.from('questions').delete().in('exam_id', examIds);
      await admin.from('exams').delete().in('id', examIds);
    }

    const { data: oldTests } = await admin.from('tests').select('id').in('room_id', roomIds);
    if (oldTests) {
      for (const t of oldTests) {
        const { data: qs } = await admin.from('test_questions').select('id').eq('test_id', t.id);
        if (qs && qs.length > 0) {
          await admin.from('test_answers').delete().in('question_id', qs.map((q) => q.id));
          await admin.from('test_options').delete().in('question_id', qs.map((q) => q.id));
          await admin.from('test_questions').delete().in('id', qs.map((q) => q.id));
        }
        await admin.from('test_participants').delete().eq('test_id', t.id);
        await admin.from('test_sessions').delete().eq('test_id', t.id);
      }
      await admin.from('tests').delete().in('id', oldTests.map((t) => t.id));
    }

    await admin.from('students').delete().in('room_id', roomIds);
    await admin.from('rooms').delete().in('id', roomIds);
    console.log('🧹 Cleaned up previous E2E data');
  } catch (e) {
    console.warn('Cleanup warning:', e);
  }
}
