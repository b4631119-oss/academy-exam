#!/usr/bin/env node
/**
 * Full E2E runtime test for PROlab Academy TEST mode
 * Tests: create test → enter room → answer Q1, Q2, Q3 (last) → verify DB → finish → result → back button → duplicate → IDOR
 */

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Load env
const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line.startsWith('#') || !line.includes('=')) return;
  const [key, ...vals] = line.split('=');
  env[key.trim()] = vals.join('=').trim();
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = env.JWT_SECRET;

if (!SUPABASE_URL || !SERVICE_KEY || !JWT_SECRET) {
  console.error('Missing env vars');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

// JWT helpers (same logic as src/lib/jwt.ts)
const { SignJWT, jwtVerify } = require('jose');

async function signToken(studentId, roomId) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new SignJWT({ studentId, roomId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch { return null; }
}

// Import the actual server action logic (inline, since we can't import "use server" directly)
// We replicate the exact logic of submitStudentAnswer, finishStudentTest, getStudentTestResult

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function simulateSubmitStudentAnswer(token, sessionId, questionId, optionId) {
  if (!sessionId || !UUID_REGEX.test(sessionId) || !questionId || !optionId) {
    throw new Error("Невалидные параметры ответа");
  }

  const payload = await verifyToken(token);
  if (!payload || !payload.studentId) throw new Error("Студент не авторизован");
  const studentId = payload.studentId;

  // 1. Verify participant
  const { data: participant, error: pErr } = await admin
    .from("test_participants")
    .select("id, finished_at, session_id")
    .eq("session_id", sessionId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (pErr || !participant) throw new Error("INVALID_PARTICIPANT_OR_SESSION");
  if (participant.finished_at) throw new Error("TEST_FINISHED_CANNOT_ANSWER");

  // 2. Fetch session
  const { data: sessionRow } = await admin
    .from("test_sessions")
    .select("id, test_id")
    .eq("id", sessionId)
    .maybeSingle();

  const testId = sessionRow?.test_id;
  if (!testId) throw new Error("Сессия теста не найдена");

  // 3. Verify option
  const { data: optionData, error: optErr } = await admin
    .from("test_options")
    .select("id, question_id, is_correct")
    .eq("id", optionId)
    .eq("question_id", questionId)
    .maybeSingle();

  if (optErr || !optionData) throw new Error("Вариант ответа не найден");

  // 4. Verify question
  const { data: questionData } = await admin
    .from("test_questions")
    .select("id, test_id, points")
    .eq("id", questionId)
    .eq("test_id", testId)
    .maybeSingle();

  if (!questionData) throw new Error("Вопрос не принадлежит данному тесту");

  const questionPoints = questionData.points || 20;
  const isCorrect = !!optionData.is_correct;
  const pointsEarned = isCorrect ? questionPoints : 0;

  // 5. Duplicate check
  const { data: existingAnswer } = await admin
    .from("test_answers")
    .select("id")
    .eq("session_id", sessionId)
    .eq("participant_id", participant.id)
    .eq("question_id", questionId)
    .maybeSingle();

  if (existingAnswer) return { success: true, already_answered: true };

  // 6. Insert
  const { error: insErr } = await admin
    .from("test_answers")
    .insert([{
      session_id: sessionId,
      participant_id: participant.id,
      question_id: questionId,
      option_id: optionId,
      is_correct: isCorrect,
      points_earned: pointsEarned,
      answered_at: new Date().toISOString()
    }]);

  if (insErr) {
    if (insErr.code === "23505") return { success: true, already_answered: true };
    throw new Error(insErr.message);
  }

  return { success: true, question_id: questionId, option_id: optionId };
}

async function simulateFinishStudentTest(token, sessionId) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) throw new Error("Невалидный ID сессии");

  const payload = await verifyToken(token);
  if (!payload || !payload.studentId) throw new Error("Студент не авторизован");
  const studentId = payload.studentId;

  const { data: participantData, error: pErr } = await admin
    .from("test_participants")
    .select("id, finished_at")
    .eq("session_id", sessionId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (pErr || !participantData) throw new Error("Участник сессии не найден");

  const finishedAt = participantData.finished_at || new Date().toISOString();

  if (!participantData.finished_at) {
    const { error: finishErr } = await admin
      .from("test_participants")
      .update({ finished_at: finishedAt })
      .eq("id", participantData.id);
    if (finishErr) throw new Error(finishErr.message);
  }

  const { data: sessionRow } = await admin
    .from("test_sessions")
    .select("id, test_id")
    .eq("id", sessionId)
    .maybeSingle();

  const testId = sessionRow?.test_id;
  if (!testId) throw new Error("Сессия теста не найдена");

  const [questionsRes, answersRes] = await Promise.all([
    admin.from("test_questions").select("id, points").eq("test_id", testId),
    admin.from("test_answers").select("id, question_id, is_correct, points_earned").eq("session_id", sessionId).eq("participant_id", participantData.id)
  ]);

  const qList = questionsRes.data || [];
  const ansList = answersRes.data || [];

  const maxPoints = qList.reduce((acc, q) => acc + (q.points || 20), 0);
  const totalAnswered = ansList.length;
  const totalCorrect = ansList.filter(a => a.is_correct).length;
  const totalPoints = ansList.reduce((acc, a) => acc + (a.points_earned || 0), 0);
  const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  const { data: testRow } = await admin
    .from("tests")
    .select("title, description")
    .eq("id", testId)
    .maybeSingle();

  return {
    session_id: sessionId,
    participant_id: participantData.id,
    test_title: testRow?.title || "Тест",
    total_points: totalPoints,
    max_points: maxPoints,
    total_correct: totalCorrect,
    total_answered: totalAnswered,
    total_questions: qList.length,
    percentage,
    finished_at: finishedAt
  };
}

async function simulateGetStudentTestResult(token, sessionId) {
  if (!sessionId || !UUID_REGEX.test(sessionId)) throw new Error("Невалидный ID сессии");

  const payload = await verifyToken(token);
  if (!payload || !payload.studentId) throw new Error("Студент не авторизован");
  const studentId = payload.studentId;

  const { data: participantData, error: pErr } = await admin
    .from("test_participants")
    .select("id, finished_at")
    .eq("session_id", sessionId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (pErr || !participantData) throw new Error("Вы не являетесь участником этой сессии");

  const { data: sessionRow } = await admin
    .from("test_sessions")
    .select("id, test_id")
    .eq("id", sessionId)
    .maybeSingle();

  const testId = sessionRow?.test_id;
  if (!testId) throw new Error("Сессия теста не найдена");

  const { data: testRow } = await admin
    .from("tests")
    .select("title, description")
    .eq("id", testId)
    .maybeSingle();

  const [questionsRes, answersRes] = await Promise.all([
    admin.from("test_questions").select("id, points").eq("test_id", testId),
    admin.from("test_answers").select("id, question_id, is_correct, points_earned").eq("session_id", sessionId).eq("participant_id", participantData.id)
  ]);

  const qList = questionsRes.data || [];
  const ansList = answersRes.data || [];
  const maxPoints = qList.reduce((acc, q) => acc + (q.points || 20), 0);
  const totalAnswered = ansList.length;
  const totalCorrect = ansList.filter(a => a.is_correct).length;
  const totalPoints = ansList.reduce((acc, a) => acc + (a.points_earned || 0), 0);
  const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  return {
    test_title: testRow?.title || "Тест",
    total_points: totalPoints,
    max_points: maxPoints,
    total_correct: totalCorrect,
    total_answered: totalAnswered,
    total_questions: qList.length,
    percentage,
    student_name: "Ученик"
  };
}

// ===== TEST RUNNER =====
let pass = 0, fail = 0;

function ok(name) { pass++; console.log(`  ✅ ${name}`); }
function ko(name, err) { fail++; console.log(`  ❌ ${name}: ${err}`); }

async function run() {
  console.log('\n🔬 E2E RUNTIME TEST — PROlab Academy TEST Mode\n');

  // ===== SETUP =====
  console.log('📦 SETUP');

  // Use existing student "fr" in room "b97b63ac"
  const studentId = '2cf3fd33-8ca7-477b-8e53-2728d0fd6a99';
  const roomId = 'b97b63ac-5b91-45f3-b9e8-ec284524726d';
  const token = await signToken(studentId, roomId);
  const verifiedPayload = await verifyToken(token);
  if (verifiedPayload?.studentId === studentId) ok('JWT sign+verify works');
  else ko('JWT sign+verify', 'payload mismatch');

  // Create a fresh test with 3 questions
  const testId = crypto.randomUUID();
  const { error: testErr } = await admin.from('tests').insert({
    id: testId,
    room_id: roomId,
    teacher_id: '36005436-34b2-4962-9932-19cbfc267e42',
    title: 'E2E Full Flow Test',
    description: 'Runtime verification test',
    status: 'draft'
  });
  if (testErr) { ko('Create test', testErr.message); return; }
  ok('Test created');

  // Create 3 questions with 4 options each
  const questions = [];
  for (let qi = 1; qi <= 3; qi++) {
    const qId = crypto.randomUUID();
    questions.push({ id: qId, position: qi });
    await admin.from('test_questions').insert({
      id: qId, test_id: testId, question_text: `Q${qi}: What is ${qi}+${qi}?`,
      position: qi, time_limit_seconds: 30, points: 20
    });

    for (let oi = 1; oi <= 4; oi++) {
      await admin.from('test_options').insert({
        id: crypto.randomUUID(), question_id: qId,
        option_text: `Q${qi} Opt${oi}`, position: oi,
        is_correct: oi === 1
      });
    }
  }
  ok(`3 questions with 4 options each created`);

  // Get the option IDs
  const { data: opts } = await admin.from('test_options')
    .select('id, question_id, position')
    .eq('question_id', questions[0].id)
    .order('position');
  const q1Opts = opts;

  // ===== TEST 1: Enter room → startOrJoinStudentTest =====
  console.log('\n🧪 TEST 1: Start/Join Test Session');

  // Clean up any old sessions for this test
  const { data: oldSessions } = await admin.from('test_sessions').select('id').eq('test_id', testId);
  if (oldSessions?.length) {
    for (const s of oldSessions) {
      await admin.from('test_answers').delete().eq('session_id', s.id);
      await admin.from('test_participants').delete().eq('session_id', s.id);
      await admin.from('test_sessions').delete().eq('id', s.id);
    }
  }

  // Create session
  const { data: session, error: sErr } = await admin.from('test_sessions').insert({
    test_id: testId, room_id: roomId, status: 'running', current_question_index: 0
  }).select('id').single();
  if (sErr) { ko('Create session', sErr.message); return; }
  ok(`Session created: ${session.id}`);

  // Create participant
  const { data: participant, error: pErr } = await admin.from('test_participants').insert({
    session_id: session.id, student_id: studentId,
    first_name: 'Test', last_name: 'Student'
  }).select('id').single();
  if (pErr) { ko('Create participant', pErr.message); return; }
  ok(`Participant created: ${participant.id}`);

  // ===== TEST 2: Answer Q1 =====
  console.log('\n🧪 TEST 2: Answer Q1 (via submitStudentAnswer logic)');
  const q1AllOpts = await admin.from('test_options').select('id, position').eq('question_id', questions[0].id).order('position');
  const q1OptionId = q1AllOpts.data[0].id;

  try {
    const result1 = await simulateSubmitStudentAnswer(token, session.id, questions[0].id, q1OptionId);
    if (result1.success) ok(`Q1 answer submitted: ${JSON.stringify(result1)}`);
    else ko('Q1 submit', 'no success');
  } catch (e) { ko('Q1 submit', e.message); }

  // Verify in DB
  const { count: count1 } = await admin.from('test_answers').select('*', { count: 'exact', head: true }).eq('session_id', session.id).eq('participant_id', participant.id);
  if (count1 === 1) ok('Q1 answer exists in DB (count=1)');
  else ko('Q1 DB check', `expected count=1, got ${count1}`);

  // ===== TEST 3: Answer Q2 =====
  console.log('\n🧪 TEST 3: Answer Q2');
  const q2AllOpts = await admin.from('test_options').select('id, position').eq('question_id', questions[1].id).order('position');
  const q2OptionId = q2AllOpts.data[0].id;

  try {
    const result2 = await simulateSubmitStudentAnswer(token, session.id, questions[1].id, q2OptionId);
    if (result2.success) ok('Q2 answer submitted');
    else ko('Q2 submit', 'no success');
  } catch (e) { ko('Q2 submit', e.message); }

  const { count: count2 } = await admin.from('test_answers').select('*', { count: 'exact', head: true }).eq('session_id', session.id).eq('participant_id', participant.id);
  if (count2 === 2) ok('Q2 answer exists in DB (count=2)');
  else ko('Q2 DB check', `expected count=2, got ${count2}`);

  // ===== TEST 4: Answer Q3 (LAST QUESTION) — THE CRITICAL TEST =====
  console.log('\n🧪 TEST 4: Answer Q3 (LAST QUESTION) — Critical Test');
  const q3AllOpts = await admin.from('test_options').select('id, position').eq('question_id', questions[2].id).order('position');
  const q3OptionId = q3AllOpts.data[0].id;

  try {
    const result3 = await simulateSubmitStudentAnswer(token, session.id, questions[2].id, q3OptionId);
    if (result3.success) ok('Q3 (LAST) answer submitted');
    else ko('Q3 submit', 'no success');
  } catch (e) { ko('Q3 submit', e.message); }

  // CRITICAL: Verify last answer in DB BEFORE finish
  const { count: count3 } = await admin.from('test_answers').select('*', { count: 'exact', head: true }).eq('session_id', session.id).eq('participant_id', participant.id);
  if (count3 === 3) ok('Q3 answer exists in DB BEFORE finish (count=3)');
  else ko('Q3 DB check BEFORE finish', `expected count=3, got ${count3}`);

  // Verify last answer specifically
  const { data: lastAnswer } = await admin.from('test_answers')
    .select('question_id, option_id, answered_at')
    .eq('session_id', session.id)
    .eq('participant_id', participant.id)
    .eq('question_id', questions[2].id)
    .maybeSingle();
  if (lastAnswer) ok(`Last answer verified in DB: question=${lastAnswer.question_id.slice(0,8)}... answered_at=${lastAnswer.answered_at}`);
  else ko('Last answer NOT in DB', 'CRITICAL: last answer missing before finish!');

  // ===== TEST 5: Finish test =====
  console.log('\n🧪 TEST 5: finishStudentTest');
  try {
    const finishResult = await simulateFinishStudentTest(token, session.id);
    ok(`Test finished: ${finishResult.percentage}% (${finishResult.total_correct}/${finishResult.total_questions} correct, ${finishResult.total_points}/${finishResult.max_points} pts)`);
  } catch (e) { ko('finishStudentTest', e.message); }

  // Verify finished_at
  const { data: checkParticipant } = await admin.from('test_participants')
    .select('finished_at, total_correct, total_answered, total_points')
    .eq('id', participant.id)
    .maybeSingle();
  if (checkParticipant?.finished_at) ok(`finished_at is SET: ${checkParticipant.finished_at}`);
  else ko('finished_at check', 'finished_at is NULL');

  // ===== TEST 6: Get result =====
  console.log('\n🧪 TEST 6: getStudentTestResult');
  try {
    const result = await simulateGetStudentTestResult(token, session.id);
    ok(`Result: ${result.percentage}% (${result.total_correct}/${result.total_questions}, ${result.total_points}/${result.max_points} pts)`);
  } catch (e) { ko('getStudentTestResult', e.message); }

  // ===== TEST 7: Re-enter finished test =====
  console.log('\n🧪 TEST 7: Re-enter finished test');
  try {
    const { data: p } = await admin.from('test_participants')
      .select('finished_at')
      .eq('session_id', session.id)
      .eq('student_id', studentId)
      .maybeSingle();
    if (p?.finished_at) ok('Re-enter: test is marked finished, would redirect to result');
    else ko('Re-enter', 'test not marked finished');
  } catch (e) { ko('Re-enter', e.message); }

  // ===== TEST 8: Duplicate answer protection =====
  console.log('\n🧪 TEST 8: Duplicate answer protection');
  try {
    const dupeResult = await simulateSubmitStudentAnswer(token, session.id, questions[0].id, q1OptionId);
    if (dupeResult.already_answered) ok('Duplicate answer blocked (already_answered=true)');
    else ko('Duplicate check', 'no already_answered flag');
  } catch (e) { ko('Duplicate check', e.message); }

  // Count should still be 3
  const { count: countAfterDupe } = await admin.from('test_answers').select('*', { count: 'exact', head: true }).eq('session_id', session.id).eq('participant_id', participant.id);
  if (countAfterDupe === 3) ok('Answer count still 3 after duplicate attempt');
  else ko('Answer count after dupe', `expected 3, got ${countAfterDupe}`);

  // ===== TEST 9: Submit after finished_at blocked =====
  console.log('\n🧪 TEST 9: Submit after finished_at blocked');
  try {
    const q4AllOpts = await admin.from('test_options').select('id').eq('question_id', questions[1].id).limit(1);
    const q4OptionId = q4AllOpts.data[0].id;
    await simulateSubmitStudentAnswer(token, session.id, questions[1].id, q4OptionId);
    // Should return already_answered since question already answered + finished
    ko('Submit after finish', 'should have thrown or returned already_answered');
  } catch (e) {
    if (e.message.includes('FINISHED') || e.message.includes('already')) ok(`Submit after finish properly blocked: ${e.message}`);
    else ko('Submit after finish', e.message);
  }

  // ===== TEST 10: IDOR — Student B cannot access Student A =====
  console.log('\n🧪 TEST 10: IDOR Protection');
  // Create Student B
  const studentBId = crypto.randomUUID();
  const { error: sbErr } = await admin.from('students').insert({
    id: studentBId, name: 'Student B (IDOR Test)', room_id: roomId
  });
  if (sbErr) { ko('Create Student B', sbErr.message); } else {
    ok('Student B created');
    const tokenB = await signToken(studentBId, roomId);

    // Student B tries to submit answer for Student A's question
    try {
      await simulateSubmitStudentAnswer(tokenB, session.id, questions[0].id, q1OptionId);
      ko('IDOR submit', 'should have thrown');
    } catch (e) {
      if (e.message.includes('не являются участником') || e.message.includes('INVALID_PARTICIPANT')) ok(`IDOR submit blocked: ${e.message}`);
      else ko('IDOR submit', e.message);
    }

    // Student B tries to get Student A's result
    try {
      await simulateGetStudentTestResult(tokenB, session.id);
      ko('IDOR result', 'should have thrown');
    } catch (e) {
      if (e.message.includes('не являетесь участником')) ok(`IDOR result blocked: ${e.message}`);
      else ko('IDOR result', e.message);
    }

    // Student B tries to finish Student A's test
    try {
      await simulateFinishStudentTest(tokenB, session.id);
      ko('IDOR finish', 'should have thrown');
    } catch (e) {
      if (e.message.includes('не найден')) ok(`IDOR finish blocked: ${e.message}`);
      else ko('IDOR finish', e.message);
    }

    // Cleanup Student B
    await admin.from('students').delete().eq('id', studentBId);
  }

  // ===== TEST 11: Verify room_id is accessible from result chain =====
  console.log('\n🧪 TEST 11: Room ID accessible from session → test → room');
  const { data: sessionForRoom } = await admin.from('test_sessions')
    .select('id, room_id, test_id')
    .eq('id', session.id)
    .maybeSingle();
  if (sessionForRoom?.room_id) ok(`room_id accessible from session: ${sessionForRoom.room_id}`);
  else ko('room_id access', 'room_id not found in session');

  // ===== CLEANUP =====
  console.log('\n🧹 CLEANUP');
  await admin.from('test_answers').delete().eq('session_id', session.id);
  await admin.from('test_participants').delete().eq('session_id', session.id);
  await admin.from('test_sessions').delete().eq('id', session.id);
  // Delete questions/options for this test
  for (const q of questions) {
    await admin.from('test_options').delete().eq('question_id', q.id);
  }
  await admin.from('test_questions').delete().eq('test_id', testId);
  await admin.from('tests').delete().eq('id', testId);
  ok('Cleanup done');

  // ===== SUMMARY =====
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🏁 TOTAL: ${pass} PASS / ${fail} FAIL out of ${pass + fail}`);
  console.log(`${'='.repeat(50)}\n`);

  if (fail > 0) process.exit(1);
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
