import Link from "next/link";
import { Calendar, HardHat, Users } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const menuItems = [
  {
    href: "/sites",
    label: "現場",
    desc: "現場の登録・確認",
    icon: HardHat,
    color: "border-blue-400 bg-blue-50 text-blue-900",
  },
  {
    href: "/schedule",
    label: "予定",
    desc: "スケジュール追加",
    icon: Calendar,
    color: "border-amber-400 bg-amber-50 text-amber-900",
  },
  {
    href: "/workers",
    label: "作業員",
    desc: "担当者の管理",
    icon: Users,
    color: "border-emerald-400 bg-emerald-50 text-emerald-900",
  },
];

export function MainMenuCards() {
  return (
    <section className="rounded-xl border-2 border-slate-400 bg-white p-4">
      <p className="text-xl font-bold">メニュー</p>
      <p className="mt-1 text-lg text-muted-foreground">
        スマホは画面<span className="font-bold text-primary">下</span>
        、PCは画面<span className="font-bold text-primary">左</span>
        にもあります
      </p>
      <div className="mt-4 grid gap-3">
        {menuItems.map(({ href, label, desc, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "tap-scale flex min-h-[72px] items-center gap-4 rounded-xl border-2 p-4 active:scale-[0.98]",
              color
            )}
          >
            <Icon className="h-10 w-10 shrink-0" strokeWidth={2.5} />
            <div>
              <p className="text-2xl font-bold">{label}</p>
              <p className="text-lg">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
