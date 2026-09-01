"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Layers, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAdminSession } from "@/lib/admin/actions";

const NAV_ITEMS = [
  {
    href: "/teacher/admin",
    label: "Дашборд",
    icon: LayoutDashboard,
  },
  {
    href: "/teacher/admin/lessons",
    label: "Уроки",
    icon: BookOpen,
  },
  {
    href: "/teacher/admin/modules",
    label: "Модули",
    icon: Layers,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar nav */}
        <nav className="sm:w-56 shrink-0" aria-label="Навигация админки">
          <div className="flex sm:flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/teacher/admin" &&
                  pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
                    isActive
                      ? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
            <div className="hidden sm:block border-t border-slate-200 dark:border-slate-700 my-2" />
            <button
              onClick={async () => {
                await clearAdminSession();
                // Force full page reload to clear client state and trigger proxy redirect
                // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                window.location.assign("/teacher/login");
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              Выйти из админки
            </button>
          </div>
        </nav>

        {/* Main content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
