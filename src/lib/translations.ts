export const t = {
  // Shared
  email: 'Email',
  password: 'Пароль',
  signIn: 'Войти',
  signingIn: 'Вход...',
  error: 'Ошибка',
  
  // Login
  teacherLogin: 'Вход для преподавателей',
  loginWelcome: 'Добро пожаловать! Введите ваши данные.',
  noAccount: 'Нет аккаунта? Зарегистрироваться',

  // Register
  teacherRegister: 'Регистрация преподавателя',
  registerWelcome: 'Создайте аккаунт для управления экзаменами.',
  hasAccount: 'Уже есть аккаунт? Войти',
  signUp: 'Зарегистрироваться',
  signingUp: 'Регистрация...',

  // Student Enter
  joinRoom: 'Вход в аудиторию',
  joinRoomDesc: 'Введите ваши данные и код, предоставленный преподавателем',
  fullName: 'Ваше полное имя',
  namePlaceholder: 'например, Иван Иванов',
  roomCode: 'Код аудитории',
  roomCodePlaceholder: 'например, A7B3C9',
  joining: 'Вход...',
  joinBtn: 'Войти в аудиторию',
  invalidRoom: 'Неверный код аудитории. Пожалуйста, проверьте и попробуйте снова.',
  nameTaken: 'Имя "{name}" уже занято в этой аудитории. Продолжить как "{finalName}"?',
  
  // Exam taking
  loadingExam: 'Загрузка экзамена...',
  noQuestions: 'В этом экзамене нет вопросов.',
  questionXofY: 'Вопрос {current} из {total}',
  yourAnswer: 'Ваш ответ:',
  typeAnswerHere: 'Напишите ваш ответ здесь...',
  previous: 'Назад',
  next: 'Далее',
  finishExam: 'Завершить экзамен',
  saving: 'Сохранение...',
  saveError: 'Не удалось сохранить ответ. Попробуйте снова.',
  unansweredWarning: 'У вас осталось {count} вопросов без ответа. Вы уверены, что хотите завершить экзамен?',

  // Teacher Dashboard
  loadingDashboard: 'Загрузка панели...',
  yourRooms: 'Ваши аудитории',
  manageClasses: 'Управляйте классами и экзаменами',
  createRoom: 'Создать аудиторию',
  noRoomsYet: 'Пока нет аудиторий',
  createFirstRoom: 'Создайте первую аудиторию, чтобы сгенерировать коды доступа для студентов.',
  roomCodeLabel: 'Код аудитории',
  viewDetails: 'Подробнее',

  // Student Rooms (Available Exams)
  loadingExams: 'Загрузка экзаменов...',
  helloStudent: 'Привет, {name}!',
  welcomeToRoom: 'Добро пожаловать в {room}. Вот доступные экзамены.',
  noExamsAvailable: 'Нет доступных экзаменов',
  teacherNoExams: 'Преподаватель еще не создал экзамены для этой аудитории. Загляните позже!',
  takeExam: 'Сдать экзамен',

  // Student Result
  loadingResults: 'Загрузка результатов...',
  backToExams: 'Вернуться к экзаменам',
  yourExamResults: 'Результаты экзамена',
  howYouDid: 'Твои результаты, {name}',
  questionsTotal: 'Вопросы',
  correct: 'Верно',
  incorrect: 'Неверно',
  pending: 'В проверке',
  detailedBreakdown: 'Подробный разбор',
  questionIndex: 'Вопрос {index}',
  inReview: 'На проверке',
  skipped: 'Пропущено',
  noAnswerProvided: 'Вы не дали ответ.',
} as const;

export type TranslationKey = keyof typeof t;
