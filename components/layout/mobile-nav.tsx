"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, HardHat, Home, Users } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "ホーム", icon: Home },
  { href: "/sites", label: "現場", icon: HardHat },
  { href: "/schedule", label: "予定", icon: Calendar },
  { href: "/workers", label: "作業員", icon: Users },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t-4 border-primary bg-card shadow-[0_-6px_24px_rgba(0,0,0,0.15)] md:hidden"
      aria-label="メインメニュー"
    >
      <p className="bg-primary py-1 text-center text-sm font-bold text-primary-foreground">
        メニュー
      </p>
      <div className="grid grid-cols-4 safe-bottom">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "tap-scale relative flex min-h-[72px] flex-col items-center justify-center gap-0.5 px-1 text-base font-bold",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 h-1 w-10 -translate-x-1/2 rounded-b-full bg-primary" />
              )}
              <Icon className={cn("h-7 w-7", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
