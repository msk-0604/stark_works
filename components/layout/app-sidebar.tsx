"use client";

import { Calendar, HardHat, Home, Users } from "lucide-react";

import { NavLink } from "@/components/layout/nav-link";
import { LABELS } from "@/lib/constants/labels";

const navItems = [
  { href: "/dashboard", label: "ホーム", icon: Home },
  { href: "/sites", label: "現場", icon: HardHat },
  { href: "/schedule", label: "予定", icon: Calendar },
  { href: "/workers", label: LABELS.member, icon: Users },
];

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r-4 border-primary bg-card md:block">
      <div className="border-b-2 border-primary/20 bg-primary/5 p-6">
        <h1 className="text-2xl font-bold text-primary">Stark Works</h1>
        <p className="mt-1 text-base font-semibold text-muted-foreground">メニュー</p>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} layout="sidebar" />
        ))}
      </nav>
    </aside>
  );
}
