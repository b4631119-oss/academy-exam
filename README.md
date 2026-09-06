# 🎓 PROlab Academy Exam

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 📋 О проекте

**PROlab Academy Exam** —  это современная и безопасная платформа для проведения онлайн-экзаменов с интегрированной защитой от списывания. Проект разработан специально для **PROlab Academy** (г. Ош, Кыргызстан) с целью обеспечения честного и прозрачного процесса тестирования студентов.

🔗 **Сайт проекта:**  [https://prolab-academy.site](https://prolab-academy.site)  
💻 **GitHub репозиторий:** [https://github.com/b4631119-oss/academy-exam](https://github.com/b4631119-oss/academy-exam)

---

## ✨ Основные возможности

### Для преподавателей:
- 🔐 Защищенная регистрация и авторизация.
- 🏫 Создание виртуальных комнат с уникальным 6-значным кодом доступа.
- 📝 Конструктор экзаменов с поддержкой неограниченного количества вопросов.
- 📊 Удобный дашборд для управления комнатами и тестами.
- ✅ Ручная проверка ответов студентов (с возможностью поставить ✅ или ❌).
- 📈 Детальная статистика и результаты по каждому вопросу.

### Для студентов:
- 🚪 Быстрый вход по индивидуальному коду доступа и имени (без сложной регистрации).
- ⏱️ Удобный интерфейс прохождения тестирования.
- 🛡️ Надежная защита во время сдачи экзамена.

### Общее:
- 🇷🇺 Полная локализация на русский язык.
- 📱 Адаптивный дизайн для любых устройств (ПК, планшеты, смартфоны).
- 🔍 SEO-оптимизация (сайт индексируется в Google).

---

## 🛡️ Защита от списывания (Anti-Cheat System)

Платформа оснащена строгой системой контроля для предотвращения нечестной сдачи экзаменов. Во время активного теста **автоматически блокируются**:

- 🚫 **Копирование и вставка** (Ctrl+C, Ctrl+V, контекстное меню).
- 🚫 **Инструменты разработчика (DevTools)** (F12, Ctrl+Shift+I).
- 🚫 **Переключение вкладок/окон** (отслеживание потери фокуса браузера).
- 🚫 **Скриншоты** (PrintScreen).
- 🚫 **Печать страницы** (Ctrl+P).
- 🚫 **Обновление страницы** (F5, Ctrl+R) для предотвращения сброса таймера или состояния.

---

## 🛠️ Технологии

| Технология | Описание |
| :--- | :--- |
| **Next.js 15** | Фреймворк для React (используется App Router). |
| **TypeScript** | Строгая типизация для надежности кода. |
| **Tailwind CSS** | Утилитарный CSS-фреймворк для стилизации. |
| **Supabase** | База данных (PostgreSQL) и аутентификация. |
| **JWT** | Безопасная авторизация сессий студентов. |
| **Vercel** | Платформа для хостинга и деплоя. |

---

## 🚀 Быстрый старт

### Требования
- Node.js 18.x или выше
- npm, pnpm или yarn
- Аккаунт Supabase (для базы данных)

### Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/b4631119-oss/academy-exam.git
cd academy-exam
```

2. Установите зависимости:
```bash
npm install
# или
yarn install
```

3. Настройте переменные окружения:
Создайте файл `.env.local` в корне проекта и добавьте ключи Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_super_secret_jwt_key
```

4. Запустите сервер разработки:
```bash
npm run dev
# или
yarn dev
```
Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

---

## 📁 Структура проекта

```text
academy-exam/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Страницы логина и регистрации преподавателей
│   │   ├── (teacher)/       # Дашборд, управление комнатами и экзаменами
│   │   ├── (student)/       # Вход для студентов, интерфейс прохождения экзамена
│   │   ├── layout.tsx       # Глобальный layout, Мета-теги, SEO
│   │   └── page.tsx         # Главная страница (Landing)
│   ├── components/          # Переиспользуемые UI компоненты
│   ├── lib/
│   │   ├── actions.ts       # Server Actions (логика работы с БД)
│   │   ├── supabase.ts      # Инициализация клиента Supabase
│   │   └── translations.ts  # Словари для локализации (Русский язык)
│   └── middleware.ts        # Защита роутов (проверка токенов/сессий)
├── public/                  # Статические файлы (изображения, иконки)
├── .env.local               # Локальные переменные окружения
└── package.json             # Зависимости и скрипты
```

---

## 📸 Скриншоты

*(Здесь будут добавлены скриншоты интерфейса платформы)*

> **Примечание:** Добавьте изображения в папку `public/screenshots/` и обновите ссылки ниже.

<div align="center">
  <!-- <img src="/screenshots/main.png" alt="Главная страница" width="800"/> -->
  <p><i>Главная страница</i></p>
  
  <!-- <img src="/screenshots/dashboard.png" alt="Дашборд преподавателя" width="800"/> -->
  <p><i>Дашборд преподавателя</i></p>

  <!-- <img src="/screenshots/exam.png" alt="Интерфейс экзамена" width="800"/> -->
  <p><i>Интерфейс прохождения экзамена</i></p>
</div>

---

## 👨‍💻 Автор

**Разработчик:** Билол  
📍 г. Ош, Кыргызстан  
💻 **GitHub:** [https://github.com/b4631119-oss](https://github.com/b4631119-oss)

---

## 🏢 Организация

Проект разработан для **PROlab Academy** (г. Ош, Кыргызстан).

---

## 📄 Лицензия

Этот проект лицензирован под лицензией MIT. Подробности см. в файле [LICENSE](LICENSE).

---

## 🙏 Благодарности

- Сообществам [Next.js](https://nextjs.org/) и [Supabase](https://supabase.com/) за отличные инструменты разработки.
