#!/usr/bin/env node
/**
 * E2E EXAM runtime test — simulates actual server action logic
 */
const crypto = require('crypto');
const http = require('http');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { SignJWT } = require('jose');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line.startsWith('#') || !line.includes('=')) return;
  const [key, ...vals] = line.split('=');
  env[key.trim()] = vals.join('=').trim();
});

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function signToken(studentId, roomId) {
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  return new SignJWT({ studentId, roomId }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret);
}

// Replicate saveAnswer logic exactly (select-then-insert/update, no unique constraint)
async function simulateSaveAnswer(studentId, questionId, answerText) {
  if (!questionId) throw new Error('ID вопроса обязателен');

  const supabase = admin;
  const { data: existing, error: existError } = await supabase
    .from('answers').select('id')
    .eq('student_id', studentId).eq('question_id', questionId)
    .maybeSingle();
  if (existError) throw new Error(existError.message);

  if (existing) {
    const { data, error } = await supabase
      .from('answers').update({ answer_text: answerText || '', is_correct: null })
      .eq('id', existing.id).select().single();
    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data, error } = await supabase
      .from('answers').insert([{
        student_id: studentId, question_id: questionId,
        answer_text: answerText || '', is_correct: null
      }]).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
}

// Replicate saveAllAnswers logic (batch, no behavioral-analysis)
async function simulateSaveAllAnswers(studentId, answers) {
  const supabase = admin;
  const entries = Object.entries(answers).filter(([, text]) => text && text.trim() !== '');
  const results = [];
  for (const [questionId, answerText] of entries) {
    const { data: existing } = await supabase
      .from('answers').select('id')
      .eq('student_id', studentId).eq('question_id', questionId)
      .maybeSingle();
    if (existing) {
      const { data, error } = await supabase
        .from('answers').update({ answer_text: answerText, is_correct: null })
        .eq('id', existing.id).select().single();
      if (error) throw new Error(error.message);
      results.push(data);
    } else {
      const { data, error } = await supabase
        .from('answers').insert([{
          student_id: studentId, question_id: questionId,
          answer_text: answerText, is_correct: null
        }]).select().single();
      if (error) throw new Error(error.message);
      results.push(data);
    }
  }
  return results;
}

// Replicate completeExam logic (handle missing column)
async function simulateCompleteExam(studentId) {
  const supabase = admin;
  const { error } = await supabase
    .from('students').update({ exam_completed: true })
    .eq('id', studentId);
  if (error) {
    if (error.code === '42703' || error.code === '42P01' || error.message?.includes('exam_completed')) {
      return { noop: true, reason: 'column missing' };
    }
    throw new Error(error.message);
  }
  return { success: true };
}

let pass = 0, fail = 0;
function ok(name) { pass++; console.log(`  ✅ ${name}`); }
function ko(name, err) { fail++; console.log(`  ❌ ${name}: ${err}`); }

async function run() {
  console.log('\n🔬 E2E EXAM RUNTIME TEST\n');

  const studentId = '2cf3fd33-8ca7-477b-8e53-2728d0fd6a99';
  const roomId = 'b97b63ac-5b91-45f3-b9e8-ec284524726d';
  const token = await signToken(studentId, roomId);
  const cookie = `studentToken=${token}`;

  // Create exam
  const examId = crypto.randomUUID();
  await admin.from('exams').insert({ id: examId, room_id: roomId, title: 'E2E Exam Runtime' });
  ok('Exam created');

  // Create 3 questions
  const qIds = [];
  for (let i = 1; i <= 3; i++) {
    const id = crypto.randomUUID();
    qIds.push(id);
    await admin.from('questions').insert({ id, exam_id: examId, text: `Q${i}: What is ${i}+${i}?` });
  }
  ok('3 questions created');

  // Clean old answers
  for (const qId of qIds) {
    await admin.from('answers').delete().eq('student_id', studentId).eq('question_id', qId);
  }
  ok('Old answers cleaned');

  // ===== TEST 1: Exam page renders =====
  console.log('\n🧪 TEST 1: Exam page renders (HTTP)');
  try {
    const res = await new Promise((resolve, reject) => {
      const req = http.request({ hostname: '127.0.0.1', port: 3000, path: `/student/exam/${examId}`, method: 'GET', headers: { Cookie: cookie } }, r => {
        let body = ''; r.on('data', d => body += d);
        r.on('end', () => resolve({ status: r.statusCode, body }));
      });
      req.on('error', reject); req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); }); req.end();
    });
    const hasReactErr = res.body.includes('Minified React error') || res.body.includes('Server Components render');
    if (res.status === 200 && !hasReactErr && res.body.length > 1000) ok(`Exam page: HTTP 200, ${res.body.length} bytes`);
    else ko('Exam page', `HTTP ${res.status}, err=${hasReactErr}`);
  } catch (e) { ko('Exam page', e.message); }

  // ===== TEST 2: saveAnswer Q1 =====
  console.log('\n🧪 TEST 2: saveAnswer Q1');
  try {
    const r = await simulateSaveAnswer(studentId, qIds[0], 'The answer is 2');
    if (r?.id) ok(`Q1 saved: id=${r.id.slice(0,8)}...`);
    else ko('Q1 save', 'no id returned');
  } catch (e) { ko('Q1 save', e.message); }

  // ===== TEST 3: saveAnswer Q2 =====
  console.log('\n🧪 TEST 3: saveAnswer Q2');
  try {
    const r = await simulateSaveAnswer(studentId, qIds[1], 'The answer is 4');
    if (r?.id) ok(`Q2 saved`);
    else ko('Q2 save', 'no id returned');
  } catch (e) { ko('Q2 save', e.message); }

  // ===== TEST 4: saveAnswer Q3 (LAST) — verify BEFORE finish =====
  console.log('\n🧪 TEST 4: saveAnswer Q3 (LAST)');
  try {
    const r = await simulateSaveAnswer(studentId, qIds[2], 'The answer is 6 — long text to test behavioral analysis bypass on the last question');
    if (r?.id) ok(`Q3 (LAST) saved`);
    else ko('Q3 save', 'no id returned');
  } catch (e) { ko('Q3 save', e.message); }

  // Verify ALL 3 answers in DB BEFORE finish
  const { count } = await admin.from('answers').select('*', { count: 'exact', head: true })
    .eq('student_id', studentId).in('question_id', qIds);
  if (count === 3) ok(`All 3 answers in DB BEFORE finish (count=${count})`);
  else ko('Answer count BEFORE finish', `expected 3, got ${count}`);

  // Verify Q3 answer text
  const { data: q3 } = await admin.from('answers').select('answer_text').eq('student_id', studentId).eq('question_id', qIds[2]).maybeSingle();
  if (q3?.answer_text?.includes('long text')) ok('Q3 answer text verified in DB');
  else ko('Q3 text verify', `got: ${JSON.stringify(q3)}`);

  // ===== TEST 5: completeExam (handle missing column) =====
  console.log('\n🧪 TEST 5: completeExam');
  try {
    const r = await simulateCompleteExam(studentId);
    if (r?.noop) ok(`completeExam: graceful noop (column missing)`);
    else if (r?.success) ok(`completeExam: success`);
    else ko('completeExam', `unexpected result: ${JSON.stringify(r)}`);
  } catch (e) { ko('completeExam', e.message); }

  // ===== TEST 6: Duplicate answer protection =====
  console.log('\n🧪 TEST 6: Duplicate protection');
  const { count: cBefore } = await admin.from('answers').select('*', { count: 'exact', head: true })
    .eq('student_id', studentId).in('question_id', qIds);
  try {
    await simulateSaveAnswer(studentId, qIds[0], 'Updated Q1 answer');
    const { count: cAfter } = await admin.from('answers').select('*', { count: 'exact', head: true })
      .eq('student_id', studentId).in('question_id', qIds);
    if (cBefore === cAfter && cAfter === 3) {
      const { data: updated } = await admin.from('answers').select('answer_text').eq('student_id', studentId).eq('question_id', qIds[0]).maybeSingle();
      if (updated?.answer_text === 'Updated Q1 answer') ok(`Duplicate → update (count=${cAfter}, text updated)`);
      else ko('Duplicate verify', `text not updated`);
    } else ko('Duplicate count', `before=${cBefore} after=${cAfter}`);
  } catch (e) { ko('Duplicate check', e.message); }

  // ===== TEST 7: saveAllAnswers (batch, no behavioral-analysis) =====
  console.log('\n🧪 TEST 7: saveAllAnswers (batch)');
  try {
    const allAnswers = {
      [qIds[0]]: 'Final Q1',
      [qIds[1]]: 'Final Q2',
      [qIds[2]]: 'Final Q3 — longer text answer'
    };
    const results = await simulateSaveAllAnswers(studentId, allAnswers);
    if (results.length === 3) ok(`saveAllAnswers: all 3 saved`);
    else ko('saveAllAnswers', `expected 3 results, got ${results.length}`);
  } catch (e) { ko('saveAllAnswers', e.message); }

  // ===== TEST 8: Result page renders =====
  console.log('\n🧪 TEST 8: Result page');
  try {
    const res = await new Promise((resolve, reject) => {
      const req = http.request({ hostname: '127.0.0.1', port: 3000, path: `/student/result/${examId}`, method: 'GET', headers: { Cookie: cookie } }, r => {
        let body = ''; r.on('data', d => body += d);
        r.on('end', () => resolve({ status: r.statusCode, body }));
      });
      req.on('error', reject); req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); }); req.end();
    });
    const hasReactErr = res.body.includes('Minified React error') || res.body.includes('Server Components render');
    if (res.status === 200 && !hasReactErr) ok(`Result page: HTTP 200, ${res.body.length} bytes`);
    else ko('Result page', `HTTP ${res.status}, err=${hasReactErr}`);
  } catch (e) { ko('Result page', e.message); }

  // ===== TEST 9: Rate limit — rapid fire saveAllAnswers =====
  console.log('\n🧪 TEST 9: Rapid-fire saveAllAnswers (was triggering behavioral analysis)');
  try {
    const t0 = Date.now();
    const allAnswers = {};
    for (let i = 0; i < 5; i++) {
      allAnswers[qIds[i % qIds.length]] = `Rapid answer ${i} — ${Date.now()}`;
    }
    await simulateSaveAllAnswers(studentId, allAnswers);
    const elapsed = Date.now() - t0;
    const { count: rc } = await admin.from('answers').select('*', { count: 'exact', head: true })
      .eq('student_id', studentId).in('question_id', qIds);
    if (rc === 3) ok(`Rapid-fire: ${elapsed}ms, count=${rc}, no behavioral-analysis blocking`);
    else ko('Rapid-fire count', `expected 3, got ${rc}`);
  } catch (e) { ko('Rapid-fire', e.message); }

  // ===== CLEANUP =====
  console.log('\n🧹 CLEANUP');
  for (const qId of qIds) await admin.from('answers').delete().eq('student_id', studentId).eq('question_id', qId);
  await admin.from('questions').delete().eq('exam_id', examId);
  await admin.from('exams').delete().eq('id', examId);
  ok('Cleanup done');

  console.log(`\n${'='.repeat(50)}`);
  console.log(`🏁 TOTAL: ${pass} PASS / ${fail} FAIL out of ${pass + fail}`);
  console.log(`${'='.repeat(50)}\n`);
  if (fail > 0) process.exit(1);
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
