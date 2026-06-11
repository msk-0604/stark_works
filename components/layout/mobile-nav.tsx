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

export function MobileNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t-4 border-primary bg-card shadow-[0_-6px_24px_rgba(0,0,0,0.15)] md:hidden"
      aria-label="メインメニュー"
    >
      <p className="bg-primary py-1 text-center text-sm font-bold text-primary-foreground">
        メニュー
      </p>
      <div className="grid grid-cols-4 safe-bottom">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} layout="mobile" />
        ))}
      </div>
    </nav>
  );
}
