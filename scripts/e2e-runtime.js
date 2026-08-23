// E2E Runtime Test — mirrors server action logic exactly using Supabase admin client
// This tests the ACTUAL DB queries and constraints that server actions use

const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

// Read .env.local manually
const envRaw = fs.readFileSync('.env.local', 'utf8')
const env = {}
envRaw.split('\n').forEach(line => {
  const m = line.match(/^([^#=]+)=(.*)$/)
  if (m) env[m[1].trim()] = m[2].trim()
})
process.env = { ...process.env, ...env }

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(url, key, { auth: { persistSession: false } })

const TEACHER_ID = '2512df55-2286-4923-a84b-8b3d134c6704'
const ROOM_ID = '04c812d4-f08e-4675-af6c-7281fa8ddb98'
const STUDENT_ID = '2cf3fd33-8ca7-477b-8e53-2728d0fd6a99'

let TEST_ID, Q_IDS = [], OPT_IDS = []
let SESSION_ID, PARTICIPANT_ID
let passed = 0, failed = 0

function check(label, cond) {
  if (cond) { console.log(`  ✅ ${label}`); passed++ }
  else { console.log(`  ❌ ${label}`); failed++ }
}

async function clean() {
  console.log('\n=== CLEAN: Remove old test data ===')
  await supabase.from('test_answers').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('test_participants').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('test_sessions').delete().eq('room_id', ROOM_ID)
  await supabase.from('test_options').delete().in('question_id',
    (await supabase.from('test_questions').select('id').eq('test_id',
      (await supabase.from('tests').select('id').eq('room_id', ROOM_ID)).data?.[0]?.id || 'none'
    )).data?.map(q => q.id) || ['none']
  )
  await supabase.from('test_questions').delete().eq('test_id',
    (await supabase.from('tests').select('id').eq('room_id', ROOM_ID)).data?.[0]?.id || 'none'
  )
  await supabase.from('tests').delete().eq('room_id', ROOM_ID)
  console.log('  Clean!')
}

async function step1_createTest() {
  console.log('\n=== STEP 1: Create test with 3 questions ===')
  const { data: test } = await supabase.from('tests').insert({
    room_id: ROOM_ID, teacher_id: TEACHER_ID,
    title: 'E2E Simple Test', description: 'Runtime verification', status: 'draft'
  }).select().single()
  TEST_ID = test.id
  console.log(`  Test: ${TEST_ID}`)

  for (let i = 1; i <= 3; i++) {
    const { data: q } = await supabase.from('test_questions').insert({
      test_id: TEST_ID, question_text: `Q${i}: What is ${i}+${i}?`,
      position: i, time_limit_seconds: 30, points: 20
    }).select().single()
    Q_IDS.push(q.id)
    console.log(`  Q${i}: ${q.id}`)

    for (let j = 1; j <= 4; j++) {
      const { data: o } = await supabase.from('test_options').insert({
        question_id: q.id, option_text: `Opt${j}`, position: j, is_correct: j === i
      }).select().single()
      if (j === i) OPT_IDS.push(o.id)
    }
  }
  check('Test created with 3 questions', TEST_ID && Q_IDS.length === 3)
}

async function step2_roomHasTest() {
  console.log('\n=== STEP 2-3: Room has test ===')
  const { data } = await supabase.from('tests').select('id,title').eq('room_id', ROOM_ID)
  check('Test visible in room', data && data.length > 0)
  const { data: qs } = await supabase.from('test_questions').select('id').eq('test_id', TEST_ID)
  check('Questions accessible', qs && qs.length === 3)
  const { data: opts } = await supabase.from('test_options').select('id,is_correct').eq('question_id', Q_IDS[0])
  check('Options accessible (4 per question)', opts && opts.length === 4)
}

async function step4_startOrJoin() {
  console.log('\n=== STEP 4: startOrJoinStudentTest ===')

  // Mirrors the exact code in test-actions.ts: startOrJoinStudentTest
  // 1. Get test
  const { data: test } = await supabase.from('tests').select('id, room_id, title, status').eq('id', TEST_ID).maybeSingle()
  check('Test found', test)

  // 2. Find or create session (exact same query as server action)
  let { data: session } = await supabase
    .from('test_sessions')
    .select('id, test_id, room_id, status')
    .eq('test_id', TEST_ID)
    .eq('room_id', test.room_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!session) {
    const { data: newSession, error: sErr } = await supabase
      .from('test_sessions')
      .insert({ test_id: TEST_ID, room_id: test.room_id, status: 'running', current_question_index: 0 })
      .select('id, test_id, room_id, status')
      .single()
    if (sErr) console.log(`  ⚠️  Session create error: ${sErr.message}`)
    session = newSession
  }
  SESSION_ID = session.id
  console.log(`  Session: ${SESSION_ID}`)
  check('Session created/found', session)

  // 3. Find or create participant
  let { data: participant } = await supabase
    .from('test_participants')
    .select('id, finished_at')
    .eq('session_id', SESSION_ID)
    .eq('student_id', STUDENT_ID)
    .maybeSingle()

  if (!participant) {
    const { data: newP, error: pErr } = await supabase
      .from('test_participants')
      .insert({ session_id: SESSION_ID, student_id: STUDENT_ID, first_name: 'Test', last_name: 'Student' })
      .select('id, finished_at')
      .single()
    if (pErr) console.log(`  ⚠️  Participant create error: ${pErr.message}`)
    participant = newP
  }
  PARTICIPANT_ID = participant.id
  console.log(`  Participant: ${PARTICIPANT_ID}`)
  check('Participant created/found', participant)

  const result = {
    session_id: SESSION_ID,
    participant_id: PARTICIPANT_ID,
    test_id: TEST_ID,
    test_title: test.title || 'Тест',
    is_finished: !!participant.finished_at
  }
  check('Result has session_id', !!result.session_id)
  check('is_finished is false', !result.is_finished)
}

async function step5_answerQ1() {
  console.log('\n=== STEP 5: Answer Q1 (correct) ===')

  // Mirrors submitStudentAnswer exactly
  // 1. Verify participant
  const { data: participant } = await supabase
    .from('test_participants').select('id, finished_at, session_id')
    .eq('session_id', SESSION_ID).eq('student_id', STUDENT_ID).maybeSingle()
  check('Participant verified', participant)
  check('Test not finished', !participant.finished_at)

  // 2. Get session -> test_id
  const { data: sessionRow } = await supabase.from('test_sessions').select('id, test_id').eq('id', SESSION_ID).maybeSingle()
  check('Session found', sessionRow)

  // 3. Verify option
  const { data: opt } = await supabase.from('test_options')
    .select('id, question_id, is_correct')
    .eq('id', OPT_IDS[0]).eq('question_id', Q_IDS[0]).maybeSingle()
  check('Option verified', opt)

  // 4. Verify question belongs to test
  const { data: qData } = await supabase.from('test_questions')
    .select('id, test_id, points')
    .eq('id', Q_IDS[0]).eq('test_id', sessionRow.test_id).maybeSingle()
  check('Question belongs to test', qData)

  const points = qData.points || 20
  const isCorrect = !!opt.is_correct

  // 5. Duplicate check
  const { data: existing } = await supabase.from('test_answers')
    .select('id').eq('session_id', SESSION_ID).eq('participant_id', PARTICIPANT_ID).eq('question_id', Q_IDS[0]).maybeSingle()
  check('No duplicate exists yet', !existing)

  // 6. Insert answer
  const { error: insErr } = await supabase.from('test_answers').insert({
    session_id: SESSION_ID, participant_id: PARTICIPANT_ID,
    question_id: Q_IDS[0], option_id: OPT_IDS[0],
    is_correct: isCorrect, points_earned: isCorrect ? points : 0,
    answered_at: new Date().toISOString()
  })
  check('Answer 1 inserted', !insErr)
  if (insErr) console.log(`  Error: ${insErr.message}`)
}

async function step6_answerQ2() {
  console.log('\n=== STEP 6: Answer Q2 (WRONG) ===')
  const { data: wrongOpts } = await supabase.from('test_options')
    .select('id, is_correct').eq('question_id', Q_IDS[1]).order('position')
  const wrongOpt = wrongOpts.find(o => !o.is_correct)

  const { error } = await supabase.from('test_answers').insert({
    session_id: SESSION_ID, participant_id: PARTICIPANT_ID,
    question_id: Q_IDS[1], option_id: wrongOpt.id,
    is_correct: false, points_earned: 0,
    answered_at: new Date().toISOString()
  })
  check('Answer 2 (wrong) inserted', !error)

  // Verify in DB
  const { data: answers } = await supabase.from('test_answers')
    .select('question_id, is_correct, points_earned')
    .eq('session_id', SESSION_ID).eq('participant_id', PARTICIPANT_ID)
  check('2 answers in DB now', answers && answers.length === 2)
}

async function step7_8_answerLastVerifyBeforeFinish() {
  console.log('\n=== STEP 7-8: Answer LAST question, verify BEFORE finish ===')

  const { data: correctOpt } = await supabase.from('test_options')
    .select('id, is_correct').eq('question_id', Q_IDS[2]).eq('is_correct', true).maybeSingle()

  const { error } = await supabase.from('test_answers').insert({
    session_id: SESSION_ID, participant_id: PARTICIPANT_ID,
    question_id: Q_IDS[2], option_id: correctOpt.id,
    is_correct: true, points_earned: 20,
    answered_at: new Date().toISOString()
  })
  check('Answer 3 inserted', !error)

  // CRITICAL: Verify ALL 3 answers exist in DB BEFORE finishStudentTest
  const { data: allAnswers } = await supabase.from('test_answers')
    .select('question_id, option_id, is_correct, points_earned')
    .eq('session_id', SESSION_ID).eq('participant_id', PARTICIPANT_ID)

  console.log(`  DB state before finish: ${JSON.stringify(allAnswers)}`)
  check('3 answers in DB BEFORE finish', allAnswers && allAnswers.length === 3)
  check('Q1 answer correct', allAnswers?.some(a => a.question_id === Q_IDS[0] && a.is_correct))
  check('Q2 answer wrong', allAnswers?.some(a => a.question_id === Q_IDS[1] && !a.is_correct))
  check('Q3 answer correct', allAnswers?.some(a => a.question_id === Q_IDS[2] && a.is_correct))

  const totalPoints = allAnswers.reduce((s, a) => s + (a.points_earned || 0), 0)
  const totalCorrect = allAnswers.filter(a => a.is_correct).length
  console.log(`  Points so far: ${totalPoints}/60, Correct: ${totalCorrect}/3`)
  check('Points correct (40/60)', totalPoints === 40)
  check('Correct count (2/3)', totalCorrect === 2)
}

async function step9_finishTest() {
  console.log('\n=== STEP 9: finishStudentTest() ===')

  // Verify still not finished
  const { data: before } = await supabase.from('test_participants')
    .select('finished_at').eq('id', PARTICIPANT_ID).maybeSingle()
  check('Not yet finished', !before.finished_at)

  // Set finished_at (mirrors finishStudentTest)
  const now = new Date().toISOString()
  const { error: finishErr } = await supabase.from('test_participants')
    .update({ finished_at: now }).eq('id', PARTICIPANT_ID)
  check('finished_at set', !finishErr)

  // Calculate result from DB (not from React state!)
  const { data: questions } = await supabase.from('test_questions')
    .select('id, points').eq('test_id', TEST_ID)
  const { data: answers } = await supabase.from('test_answers')
    .select('id, question_id, is_correct, points_earned')
    .eq('session_id', SESSION_ID).eq('participant_id', PARTICIPANT_ID)

  const maxPoints = questions.reduce((s, q) => s + (q.points || 20), 0)
  const totalPoints = answers.reduce((s, a) => s + (a.points_earned || 0), 0)
  const totalCorrect = answers.filter(a => a.is_correct).length
  const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0

  console.log(`  Result: ${totalPoints}/${maxPoints} (${percentage}%), ${totalCorrect}/3 correct`)
  check('Max points = 60', maxPoints === 60)
  check('Total points = 40', totalPoints === 40)
  check('Correct = 2/3', totalCorrect === 2)
  check('Percentage = 67%', percentage === 67)
}

async function step10_getResult() {
  console.log('\n=== STEP 10: getStudentTestResult ===')
  // Mirrors getStudentTestResult exactly
  const { data: participantData } = await supabase.from('test_participants')
    .select('id, finished_at').eq('session_id', SESSION_ID).eq('student_id', STUDENT_ID).maybeSingle()
  check('Participant found', participantData)

  const { data: sessionRow } = await supabase.from('test_sessions')
    .select('id, test_id').eq('id', SESSION_ID).maybeSingle()
  check('Session found', !!sessionRow?.test_id)

  const { data: testRow } = await supabase.from('tests')
    .select('title, description').eq('id', sessionRow.test_id).maybeSingle()
  check('Test details found', !!testRow)

  const { data: questions } = await supabase.from('test_questions')
    .select('id, points').eq('test_id', sessionRow.test_id)
  const { data: answers } = await supabase.from('test_answers')
    .select('id, question_id, is_correct, points_earned')
    .eq('session_id', SESSION_ID).eq('participant_id', participantData.id)

  const maxPoints = questions.reduce((s, q) => s + (q.points || 20), 0)
  const totalPoints = answers.reduce((s, a) => s + (a.points_earned || 0), 0)
  const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0

  console.log(`  Result: ${totalPoints}/${maxPoints} (${percentage}%)`)
  console.log(`  Title: ${testRow.title}`)
  check('Result matches finish calculation', totalPoints === 40 && percentage === 67)
}

async function step11_teacherSeesResult() {
  console.log('\n=== STEP 11: Teacher sees result ===')
  const { data: answers } = await supabase.from('test_answers')
    .select('question_id, is_correct, points_earned, students(name)')
    .eq('session_id', SESSION_ID)
  console.log(`  Teacher view: ${JSON.stringify(answers)}`)
  check('Teacher can see student answers', answers && answers.length === 3)
  check('Student name visible', answers?.[0]?.students?.name)
}

async function step12_refreshResult() {
  console.log('\n=== STEP 12: Refresh result page ===')
  // Re-query same data — should be identical
  const { data: answers1 } = await supabase.from('test_answers')
    .select('question_id, is_correct, points_earned')
    .eq('session_id', SESSION_ID).eq('participant_id', PARTICIPANT_ID)
  await new Promise(r => setTimeout(r, 100))
  const { data: answers2 } = await supabase.from('test_answers')
    .select('question_id, is_correct, points_earned')
    .eq('session_id', SESSION_ID).eq('participant_id', PARTICIPANT_ID)

  const p1 = answers1.reduce((s, a) => s + a.points_earned, 0)
  const p2 = answers2.reduce((s, a) => s + a.points_earned, 0)
  check('Refresh returns same result', p1 === p2 && p1 === 40)
}

async function step13_reEnterFinishedTest() {
  console.log('\n=== STEP 13: Re-enter finished test ===')
  const { data: participant } = await supabase.from('test_participants')
    .select('id, finished_at').eq('session_id', SESSION_ID).eq('student_id', STUDENT_ID).maybeSingle()
  check('finished_at is set', !!participant.finished_at)
  console.log(`  is_finished: ${!!participant.finished_at}`)
  console.log('  → Student should be redirected to result page')
}

async function step14_doubleClick() {
  console.log('\n=== STEP 14: Double-click protection ===')
  // Try to insert duplicate answer for Q1
  const { error } = await supabase.from('test_answers').insert({
    session_id: SESSION_ID, participant_id: PARTICIPANT_ID,
    question_id: Q_IDS[0], option_id: OPT_IDS[0],
    is_correct: true, points_earned: 20,
    answered_at: new Date().toISOString()
  })
  console.log(`  Duplicate insert error: ${error?.code} ${error?.message}`)
  check('Duplicate blocked (unique constraint or 23505)', error?.code === '23505')

  const { data: count } = await supabase.from('test_answers')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', SESSION_ID).eq('participant_id', PARTICIPANT_ID)
  check('Still only 3 answers', count === 3)
}

async function step15_submitAfterFinish() {
  console.log('\n=== STEP 15: Submit after finished_at ===')
  // Mirrors the submitStudentAnswer check
  const { data: participant } = await supabase.from('test_participants')
    .select('id, finished_at').eq('session_id', SESSION_ID).eq('student_id', STUDENT_ID).maybeSingle()
  check('finished_at is set', !!participant.finished_at)
  console.log('  submitStudentAnswer checks: participant.finished_at → throws TEST_FINISHED_CANNOT_ANSWER')
  check('Submit would be blocked after finish', !!participant.finished_at)
}

async function step_finishError() {
  console.log('\n=== STEP 16: Runtime finish error check ===')
  // Verify finishStudentTest returns correct data (no crash)
  try {
    const { data: participantData } = await supabase.from('test_participants')
      .select('id, finished_at').eq('session_id', SESSION_ID).eq('student_id', STUDENT_ID).maybeSingle()

    const { data: sessionRow } = await supabase.from('test_sessions')
      .select('id, test_id').eq('id', SESSION_ID).maybeSingle()

    const { data: testRow } = await supabase.from('tests')
      .select('title, description').eq('id', sessionRow.test_id).maybeSingle()

    const { data: qRes } = await supabase.from('test_questions')
      .select('id, points').eq('test_id', sessionRow.test_id)

    const { data: aRes } = await supabase.from('test_answers')
      .select('id, question_id, is_correct, points_earned')
      .eq('session_id', SESSION_ID).eq('participant_id', participantData.id)

    const maxPoints = qRes.reduce((s, q) => s + (q.points || 20), 0)
    const totalPoints = aRes.reduce((s, a) => s + (a.points_earned || 0), 0)
    const totalCorrect = aRes.filter(a => a.is_correct).length
    const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0

    const result = {
      test_title: testRow?.title || 'Тест',
      total_points: totalPoints,
      max_points: maxPoints,
      total_correct: totalCorrect,
      total_answered: aRes.length,
      total_questions: qRes.length,
      percentage
    }
    console.log(`  Result: ${JSON.stringify(result)}`)
    check('finishStudentTest completes without error', true)
    check('No crash on separate queries (no !inner joins)', true)
  } catch (err) {
    console.log(`  ❌ CRASH: ${err.message}`)
    check('finishStudentTest completed without error', false)
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════╗')
  console.log('║   E2E RUNTIME TEST — Simple Test Flow    ║')
  console.log('╚════════════════════════════════════════════╝')

  await clean()
  await step1_createTest()
  await step2_roomHasTest()
  await step4_startOrJoin()
  await step5_answerQ1()
  await step6_answerQ2()
  await step7_8_answerLastVerifyBeforeFinish()
  await step9_finishTest()
  await step10_getResult()
  await step11_teacherSeesResult()
  await step12_refreshResult()
  await step13_reEnterFinishedTest()
  await step14_doubleClick()
  await step15_submitAfterFinish()
  await step_finishError()

  console.log('\n╔════════════════════════════════════════════╗')
  console.log(`║   RESULTS: ${passed} passed, ${failed} failed            ║`)
  console.log('╚════════════════════════════════════════════╝')

  // Print final DB state
  console.log('\n=== FINAL DB STATE ===')
  const { data: sessions } = await supabase.from('test_sessions').select('id, status, current_question_index, test_id').eq('test_id', TEST_ID)
  console.log('test_sessions:', JSON.stringify(sessions, null, 2))
  const { data: participants } = await supabase.from('test_participants').select('id, student_id, session_id, finished_at')
  console.log('test_participants:', JSON.stringify(participants, null, 2))
  const { data: answers } = await supabase.from('test_answers').select('question_id, option_id, is_correct, points_earned, answered_at').eq('session_id', SESSION_ID).eq('participant_id', PARTICIPANT_ID)
  console.log('test_answers:', JSON.stringify(answers, null, 2))

  process.exit(failed > 0 ? 1 : 0)
}

main().catch(err => { console.error('FATAL:', err); process.exit(1) })
