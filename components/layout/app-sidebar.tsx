"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, HardHat, Home, Users } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: Home },
  { href: "/sites", label: "現場管理", icon: HardHat },
  { href: "/schedule", label: "スケジュール", icon: Calendar },
  { href: "/workers", label: "作業員管理", icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r-4 border-primary bg-card md:block">
      <div className="border-b-2 border-primary/20 bg-primary/5 p-6">
        <h1 className="text-2xl font-bold text-primary">Stark Works</h1>
        <p className="mt-1 text-base font-semibold text-muted-foreground">メニュー</p>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-[56px] items-center gap-3 rounded-lg px-4 text-lg font-bold transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
