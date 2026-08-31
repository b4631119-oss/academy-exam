import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://prolab-academy.site"),
  title: "PROlab Academy — Образовательная платформа",
  description: "PROlab Academy — современная образовательная платформа для проведения экзаменов, управления студентами и оценками. Обучение в Оше, Кыргызстан.",
  keywords: [
    "PROlab Academy",
    "PROLAB Academy",
    "PROLAB Academy Exam",
    "PROLAB Agency",
    "PROLAB Ош",
    "PROLAB Кыргызстан",
    "PROLAB IT Academy",
    "PROLAB обучение",
    "PROLAB курсы",
    "PROLAB тестирование",
    "PROLAB экзамены",

    "образовательная платформа",
    "онлайн экзамены",
    "управление студентами",
    "обучение в Оше",
    "Кыргызстан образование",
    "PROlab Ош",
    "академия",
    "оценки студентов",
    "экзамены онлайн",
    "проведение экзаменов онлайн",
    "система тестирования",
    "платформа для экзаменов",
    "пройти тест онлайн",
    "онлайн тестирование студентов",
    "индивидуальный код доступа",
    "вход в систему тестирования",
    "создание экзаменов онлайн",
    "автоматическая оценка знаний",
    "проверка результатов тестирования",
    "экзамены для преподавателей",
    "Academy Exam",
    "PROlab тестирование",
    "тестирование в Оше",
    "тестирование в Кыргызстане",
    "онлайн экзамены для студентов",
    "экзамены без списывания",
    "защита от ИИ на экзаменах",
    "система прокторинга",
    "онлайн проверка знаний",
    "дистанционное тестирование",
    "академия программирования Ош",
    "IT курсы Ош",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "PROlab Academy — Образовательная платформа",
    description: "PROlab Academy — современная образовательная платформа для проведения экзаменов и управления студентами.",
    type: "website",
    url: "https://prolab-academy.site",
    siteName: "PROlab Academy",
    images: [
      {
        url: "/hero-image.png",
        width: 1200,
        height: 630,
        alt: "Платформа PROlab Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PROlab Academy — Образовательная платформа",
    description: "PROlab Academy — современная образовательная платформа для проведения экзаменов и управления студентами.",
    images: ["/hero-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var resolved = theme === 'system'
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : theme;
                  document.documentElement.classList.add(resolved);
                  document.documentElement.classList.add('no-transition');
                  setTimeout(function() { document.documentElement.classList.remove('no-transition'); }, 300);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
