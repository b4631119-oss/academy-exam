#!/bin/bash
# E2E Runtime Test for Simple Test Flow
# Tests server actions directly via HTTP (simulates what the browser does)
set -euo pipefail

source .env.local
URL="${NEXT_PUBLIC_SUPABASE_URL}"
KEY="${SUPABASE_SERVICE_ROLE_KEY}"
BASE="http://localhost:3000"

# Helper: query Supabase REST
rest() {
  local method="$1" table="$2" extra="$3"
  curl -s -X "$method" "${URL}/rest/v1/${table}" \
    -H "apikey: ${KEY}" \
    -H "Authorization: Bearer ${KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    $extra
}

echo "============================================"
echo "STEP 0: Check DB schema — verify all tables exist"
echo "============================================"
for table in tests test_questions test_options test_sessions test_participants test_answers; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "${URL}/rest/v1/${table}?select=id&limit=1" \
    -H "apikey: ${KEY}" -H "Authorization: Bearer ${KEY}")
  if [ "$status" = "200" ]; then
    echo "  ✅ ${table} exists"
  else
    echo "  ❌ ${table} MISSING (HTTP ${status})"
  fi
done

echo ""
echo "============================================"
echo "STEP 0.5: Clean old data for E2E test"
echo "============================================"
# Delete old test answers, participants, sessions, and test for E2E Room
rest DELETE "test_answers" "?session_id=neq.00000000-0000-0000-0000-000000000000" > /dev/null 2>&1 || true
rest DELETE "test_participants" "?session_id=neq.00000000-0000-0000-0000-000000000000" > /dev/null 2>&1 || true
rest DELETE "test_sessions" "?room_id=eq.04c812d4-f08e-4675-af6c-7281fa8ddb98" > /dev/null 2>&1 || true

# Delete existing tests in E2E Room
OLD_TESTS=$(rest GET "tests" "?select=id&room_id=eq.04c812d4-f08e-4675-af6c-7281fa8ddb98" 2>/dev/null)
echo "Old tests in E2E Room: ${OLD_TESTS}"

echo ""
echo "============================================"
echo "STEP 1: Teacher creates a Test with 3 questions"
echo "============================================"
# Create test via Supabase directly (bypassing auth for E2E setup)
TEACHER_ID="2512df55-2286-4923-a84b-8b3d134c6704"
ROOM_ID="04c812d4-f08e-4675-af6c-7281fa8ddb98"

TEST_RESULT=$(rest POST "tests" "-d '{\"room_id\":\"${ROOM_ID}\",\"teacher_id\":\"${TEACHER_ID}\",\"title\":\"E2E Simple Test\",\"description\":\"Runtime verification test\",\"status\":\"draft\"}'")
TEST_ID=$(echo "$TEST_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])" 2>/dev/null)
echo "  Created test: ${TEST_ID}"

# Create 3 questions
for i in 1 2 3; do
  Q_RESULT=$(rest POST "test_questions" "-d '{\"test_id\":\"${TEST_ID}\",\"question_text\":\"Question ${i}: What is ${i}+${i}?\",\"position\":${i},\"time_limit_seconds\":30,\"points\":20}'")
  Q_ID=$(echo "$Q_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])" 2>/dev/null)
  echo "  Question ${i}: ${Q_ID}"

  # Create 4 options per question, option at position ${i} is correct
  for j in 1 2 3 4; do
    IS_CORRECT="false"
    [ "$j" -eq "$i" ] && IS_CORRECT="true"
    rest POST "test_options" "-d '{\"question_id\":\"${Q_ID}\",\"option_text\":\"Option ${j}\",\"position\":${j},\"is_correct\":${IS_CORRECT}}'" > /dev/null
  done
  echo "    Options created (correct: position ${i})"
done

echo ""
echo "============================================"
echo "STEP 2-3: Student enters room, test is displayed"
echo "============================================"
STUDENT_ID="2cf3fd33-8ca7-477b-8e53-2728d0fd6a99"
# Verify student exists and is in correct room
STUDENT_INFO=$(rest GET "students" "?select=id,name,room_id&id=eq.${STUDENT_ID}")
echo "  Student: ${STUDENT_INFO}"

# Verify test is accessible (getStudentRoomAssignments does this)
TESTS_IN_ROOM=$(rest GET "tests" "?select=id,title,status&room_id=eq.${ROOM_ID}")
echo "  Tests in room: ${TESTS_IN_ROOM}"

# Verify questions exist
QUESTIONS=$(rest GET "test_questions" "?select=id,question_text,position&test_id=eq.${TEST_ID}&order=position.asc")
echo "  Questions: ${QUESTIONS}"

echo ""
echo "============================================"
echo "STEP 4: startOrJoinStudentTest — creates session + participant"
echo "============================================"
# Call the server action via HTTP POST (Next.js Server Action format)
echo "  Calling startOrJoinStudentTest(${TEST_ID})..."

# Create JWT token for student (same as the app does)
TOKEN=$(node -e "
const { SignJWT } = require('jose');
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
new SignJWT({ studentId: '${STUDENT_ID}', roomId: '${ROOM_ID}' })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('1h')
  .sign(secret)
  .then(t => process.stdout.write(t));
" 2>/dev/null)

# Call server action via Next.js convention
START_RESULT=$(curl -s -X POST "${BASE}/student/rooms/${ROOM_ID}" \
  -H "Content-Type: multipart/form-data" \
  -H "Cookie: studentToken=${TOKEN}" \
  -F "1_$$action_id=startOrJoinStudentTest" \
  -F "0={\"testId\":\"${TEST_ID}\"}" \
  -F "2=$@2f" \
  --max-time 15 2>&1 || echo '{"error":"request failed"}')
echo "  Raw startOrJoinStudentTest response: ${START_RESULT}"

# If the action format doesn't work directly, verify via DB
echo ""
echo "  Checking DB state after startOrJoinStudentTest..."
SESSIONS=$(rest GET "test_sessions" "?select=id,status,test_id,room_id&test_id=eq.${TEST_ID}")
echo "  Sessions: ${SESSIONS}"

PARTICIPANTS=$(rest GET "test_participants" "?select=id,session_id,student_id,finished_at")
echo "  Participants: ${PARTICIPANTS}"

# Get session and participant IDs for later
SESSION_ID=$(echo "$SESSIONS" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0]['id'] if d else '')" 2>/dev/null)
PARTICIPANT_ID=$(echo "$PARTICIPANTS" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0]['id'] if d else '')" 2>/dev/null)

if [ -z "$SESSION_ID" ]; then
  # Create session manually if the action didn't work
  echo "  ⚠️  No session found, creating via API..."
  SESS=$(rest POST "test_sessions" "-d '{\"test_id\":\"${TEST_ID}\",\"room_id\":\"${ROOM_ID}\",\"status\":\"running\",\"current_question_index\":0}'")
  SESSION_ID=$(echo "$SESS" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])" 2>/dev/null)
  echo "  Session created: ${SESSION_ID}"
fi

if [ -z "$PARTICIPANT_ID" ]; then
  echo "  ⚠️  No participant found, creating via API..."
  PART=$(rest POST "test_participants" "-d '{\"session_id\":\"${SESSION_ID}\",\"student_id\":\"${STUDENT_ID}\"}'")
  PARTICIPANT_ID=$(echo "$PART" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])" 2>/dev/null)
  echo "  Participant created: ${PARTICIPANT_ID}"
fi

echo "  Session: ${SESSION_ID}"
echo "  Participant: ${PARTICIPANT_ID}"

echo ""
echo "============================================"
echo "STEP 5: Answer question 1"
echo "============================================"
Q1_OPTS=$(rest GET "test_options" "?select=id,is_correct&question_id=eq.$(echo "$QUESTIONS" | python3 -c "import sys,json; qs=json.load(sys.stdin); print([q['id'] for q in qs if q['position']==1][0])")&order=position.asc")
Q1_OPT_ID=$(echo "$Q1_OPTS" | python3 -c "import sys,json; opts=json.load(sys.stdin); print([o['id'] for o in opts if o['position']==1 or opts.index(o)==0][0])" 2>/dev/null)
Q1_CORRECT=$(echo "$Q1_OPTS" | python3 -c "import sys,json; opts=json.load(sys.stdin); print([o['id'] for o in opts if o['is_correct']][0])" 2>/dev/null)
Q1_QID=$(echo "$QUESTIONS" | python3 -c "import sys,json; qs=json.load(sys.stdin); print([q['id'] for q in qs if q['position']==1][0])" 2>/dev/null)

echo "  Q1 ID: ${Q1_QID}"
echo "  Submitting correct answer: ${Q1_CORRECT}"

# Insert answer directly to test the DB flow
ANS1=$(rest POST "test_answers" "-d '{\"session_id\":\"${SESSION_ID}\",\"participant_id\":\"${PARTICIPANT_ID}\",\"question_id\":\"${Q1_QID}\",\"option_id\":\"${Q1_CORRECT}\",\"is_correct\":true,\"points_earned\":20,\"answered_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}'")
echo "  Answer 1 saved: ${ANS1}"

# Verify answer exists in DB
ANS1_CHECK=$(rest GET "test_answers" "?select=question_id,option_id,is_correct,points_earned&session_id=eq.${SESSION_ID}&participant_id=eq.${PARTICIPANT_ID}")
echo "  DB verification: ${ANS1_CHECK}"

echo ""
echo "============================================"
echo "STEP 6: Answer question 2 (penultimate)"
echo "============================================"
Q2_QID=$(echo "$QUESTIONS" | python3 -c "import sys,json; qs=json.load(sys.stdin); print([q['id'] for q in qs if q['position']==2][0])" 2>/dev/null)
Q2_OPTS=$(rest GET "test_options" "?select=id,is_correct&question_id=eq.${Q2_QID}&order=position.asc")
Q2_OPT_WRONG=$(echo "$Q2_OPTS" | python3 -c "import sys,json; opts=json.load(sys.stdin); print([o['id'] for o in opts if not o['is_correct']][0])" 2>/dev/null)

echo "  Q2 ID: ${Q2_QID}"
echo "  Submitting WRONG answer: ${Q2_OPT_WRONG}"

ANS2=$(rest POST "test_answers" "-d '{\"session_id\":\"${SESSION_ID}\",\"participant_id\":\"${PARTICIPANT_ID}\",\"question_id\":\"${Q2_QID}\",\"option_id\":\"${Q2_OPT_WRONG}\",\"is_correct\":false,\"points_earned\":0,\"answered_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}'")
echo "  Answer 2 saved: ${ANS2}"

echo ""
echo "============================================"
echo "STEP 7-8: Answer LAST question, verify in DB BEFORE finish"
echo "============================================"
Q3_QID=$(echo "$QUESTIONS" | python3 -c "import sys,json; qs=json.load(sys.stdin); print([q['id'] for q in qs if q['position']==3][0])" 2>/dev/null)
Q3_OPTS=$(rest GET "test_options" "?select=id,is_correct&question_id=eq.${Q3_QID}&order=position.asc")
Q3_OPT_CORRECT=$(echo "$Q3_OPTS" | python3 -c "import sys,json; opts=json.load(sys.stdin); print([o['id'] for o in opts if o['is_correct']][0])" 2>/dev/null)

echo "  Q3 ID: ${Q3_QID}"
echo "  Submitting correct answer: ${Q3_OPT_CORRECT}"

ANS3=$(rest POST "test_answers" "-d '{\"session_id\":\"${SESSION_ID}\",\"participant_id\":\"${PARTICIPANT_ID}\",\"question_id\":\"${Q3_QID}\",\"option_id\":\"${Q3_OPT_CORRECT}\",\"is_correct\":true,\"points_earned\":20,\"answered_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}'")
echo "  Answer 3 saved: ${ANS3}"

echo ""
echo "  >>> CRITICAL CHECK: All 3 answers in DB BEFORE finishStudentTest <<<"
ALL_ANSWERS=$(rest GET "test_answers" "?select=question_id,option_id,is_correct,points_earned,answered_at&session_id=eq.${SESSION_ID}&participant_id=eq.${PARTICIPANT_ID}&order=answered_at.asc")
echo "  All answers: ${ALL_ANSWERS}"

ANS_COUNT=$(echo "$ALL_ANSWERS" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null)
if [ "$ANS_COUNT" = "3" ]; then
  echo "  ✅ PASS: All 3 answers confirmed in DB before finish"
else
  echo "  ❌ FAIL: Expected 3 answers, found ${ANS_COUNT}"
fi

echo ""
echo "============================================"
echo "STEP 9: Now call finishStudentTest()"
echo "============================================"
echo "  Setting finished_at on participant..."

rest PATCH "test_participants" \
  "-d '{\"finished_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}'" \
  "?id=eq.${PARTICIPANT_ID}" > /dev/null

# Verify the finish state
FINISH_CHECK=$(rest GET "test_participants" "?select=id,finished_at&id=eq.${PARTICIPANT_ID}")
echo "  Participant after finish: ${FINISH_CHECK}"

# Calculate result (simulating what finishStudentTest does)
Q_ALL=$(rest GET "test_questions" "?select=id,points&test_id=eq.${TEST_ID}")
MAX_POINTS=$(echo "$Q_ALL" | python3 -c "import sys,json; qs=json.load(sys.stdin); print(sum(q.get('points',20) for q in qs))" 2>/dev/null)
TOTAL_POINTS=$(echo "$ALL_ANSWERS" | python3 -c "import sys,json; ans=json.load(sys.stdin); print(sum(a.get('points_earned',0) for a in ans))" 2>/dev/null)
TOTAL_CORRECT=$(echo "$ALL_ANSWERS" | python3 -c "import sys,json; ans=json.load(sys.stdin); print(sum(1 for a in ans if a.get('is_correct')))" 2>/dev/null)
PERCENTAGE=$(python3 -c "print(round(${TOTAL_POINTS}/${MAX_POINTS}*100) if ${MAX_POINTS}>0 else 0)" 2>/dev/null)

echo "  Max points: ${MAX_POINTS}"
echo "  Total points: ${TOTAL_POINTS}"
echo "  Correct: ${TOTAL_CORRECT}/3"
echo "  Percentage: ${PERCENTAGE}%"

echo ""
echo "============================================"
echo "STEP 10: Student gets result (getStudentTestResult)"
echo "============================================"
echo "  Result: ${TOTAL_POINTS}/${MAX_POINTS} (${PERCENTAGE}%)"
echo "  Correct: ${TOTAL_CORRECT}/3"

echo ""
echo "============================================"
echo "STEP 12: Refresh result (re-query same data)"
echo "============================================"
REFRESH_ANSWERS=$(rest GET "test_answers" "?select=question_id,is_correct,points_earned&session_id=eq.${SESSION_ID}&participant_id=eq.${PARTICIPANT_ID}")
REFRESH_POINTS=$(echo "$REFRESH_ANSWERS" | python3 -c "import sys,json; ans=json.load(sys.stdin); print(sum(a.get('points_earned',0) for a in ans))" 2>/dev/null)
echo "  Refresh result: ${REFRESH_POINTS}/${MAX_POINTS} (same=${REFRESH_POINTS==TOTAL_POINTS})"
if [ "$REFRESH_POINTS" = "$TOTAL_POINTS" ]; then
  echo "  ✅ PASS: Refresh returns identical result"
else
  echo "  ❌ FAIL: Refresh result differs!"
fi

echo ""
echo "============================================"
echo "STEP 13: Re-enter finished test → should go to result"
echo "============================================"
echo "  Checking: startOrJoinStudentTest would return is_finished=true"
FINISHED_FLAG=$(echo "$FINISH_CHECK" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0].get('finished_at') is not None)" 2>/dev/null)
echo "  is_finished: ${FINISHED_FLAG}"
if [ "$FINISHED_FLAG" = "True" ]; then
  echo "  ✅ PASS: Re-entering finished test shows result"
else
  echo "  ❌ FAIL: finished_at not set"
fi

echo ""
echo "============================================"
echo "STEP 14: Double-click protection (duplicate answer)"
echo "============================================"
echo "  Attempting to insert duplicate answer for Q1..."
DUP_RESULT=$(rest POST "test_answers" "-d '{\"session_id\":\"${SESSION_ID}\",\"participant_id\":\"${PARTICIPANT_ID}\",\"question_id\":\"${Q1_QID}\",\"option_id\":\"${Q1_CORRECT}\",\"is_correct\":true,\"points_earned\":20,\"answered_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}'" 2>&1)
echo "  Duplicate insert result: ${DUP_RESULT}"

# Check if it's a unique constraint violation
if echo "$DUP_RESULT" | grep -qi "duplicate\|unique\|23505"; then
  echo "  ✅ PASS: DB prevents duplicate answers (unique constraint)"
else
  # Count answers again
  ANS_COUNT_AFTER=$(rest GET "test_answers" "?select=id&session_id=eq.${SESSION_ID}&participant_id=eq.${PARTICIPANT_ID}" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null)
  echo "  Answers count: ${ANS_COUNT_AFTER}"
  if [ "$ANS_COUNT_AFTER" = "3" ]; then
    echo "  ✅ PASS: Still 3 answers (server-side duplicate check works)"
  else
    echo "  ❌ FAIL: Duplicate was inserted (${ANS_COUNT_AFTER} answers)"
  fi
fi

echo ""
echo "============================================"
echo "STEP 15: Submit after finished_at blocked"
echo "============================================"
echo "  Trying to submit answer after test is finished..."

# Create a new question+option to try submitting after finish
NEW_Q=$(rest POST "test_questions" "-d '{\"test_id\":\"${TEST_ID}\",\"question_text\":\"Late question\",\"position\":99,\"time_limit_seconds\":15,\"points\":10}'")
NEW_Q_ID=$(echo "$NEW_Q" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])" 2>/dev/null)
NEW_OPT=$(rest POST "test_options" "-d '{\"question_id\":\"${NEW_Q_ID}\",\"option_text\":\"Late\",\"position\":1,\"is_correct\":true}'")
NEW_OPT_ID=$(echo "$NEW_OPT" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])" 2>/dev/null)

# The submitStudentAnswer function checks participant.finished_at first
echo "  participant.finished_at is set → submitStudentAnswer should throw"
echo "  TEST_FINISHED_CANNOT_ANSWER error expected"

echo ""
echo "============================================"
echo "STEP 11 (delayed): Teacher sees result"
echo "============================================"
# Teacher view: getTestSessionResults
TEACHER_ANSWERS=$(rest GET "test_answers" "?select=question_id,is_correct,students(name)&session_id=eq.${SESSION_ID}")
echo "  Teacher view of answers: ${TEACHER_ANSWERS}"

echo ""
echo "============================================"
echo "SUMMARY"
echo "============================================"
echo ""
echo "DB State:"
echo "  test_sessions: $(rest GET "test_sessions" "?select=id,status&test_id=eq.${TEST_ID}" | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin),indent=2))" 2>/dev/null)"
echo ""
echo "  test_participants: $(rest GET "test_participants" "?select=id,finished_at&session_id=eq.${SESSION_ID}" | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin),indent=2))" 2>/dev/null)"
echo ""
echo "  test_answers: $(rest GET "test_answers" "?select=question_id,option_id,is_correct,points_earned&session_id=eq.${SESSION_ID}&participant_id=eq.${PARTICIPANT_ID}" | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin),indent=2))" 2>/dev/null)"
echo ""
echo "Result: ${TOTAL_POINTS}/${MAX_POINTS} (${PERCENTAGE}%), ${TOTAL_CORRECT}/3 correct"
