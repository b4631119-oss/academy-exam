import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Academy Exam | Система проведения экзаменов",
  description: "Надежная и защищенная платформа для проведения онлайн экзаменов и тестирования студентов.",
  keywords: ["экзамены", "тестирование", "образование", "academy exam", "онлайн тесты"],
  openGraph: {
    title: "Academy Exam | Онлайн тестирование",
    description: "Платформа для проведения защищенных онлайн экзаменов",
    type: "website",
    locale: "ru_RU",
    siteName: "Academy Exam"
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
