import Link from "next/link";
import { Calendar, HardHat, Plus, Users } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const menuItems = [
  {
    href: "/sites",
    addHref: "/sites/new",
    addLabel: "現場を登録",
    label: "現場",
    desc: "現場の一覧・確認",
    icon: HardHat,
    color: "border-blue-400 bg-blue-50 text-blue-900",
  },
  {
    href: "/schedule",
    addHref: "/schedule?add=1",
    addLabel: "予定を追加",
    label: "予定",
    desc: "スケジュール確認",
    icon: Calendar,
    color: "border-amber-400 bg-amber-50 text-amber-900",
  },
  {
    href: "/workers",
    addHref: "/workers/new",
    addLabel: "作業員を登録",
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
        {menuItems.map(({ href, addHref, addLabel, label, desc, icon: Icon, color }) => (
          <div key={href} className={cn("rounded-xl border-2 p-4", color)}>
            <Link
              href={href}
              className="tap-scale flex min-h-[64px] items-center gap-4 active:scale-[0.98]"
            >
              <Icon className="h-10 w-10 shrink-0" strokeWidth={2.5} />
              <div>
                <p className="text-2xl font-bold">{label}</p>
                <p className="text-lg">{desc}</p>
              </div>
            </Link>
            <Link
              href={addHref}
              className="tap-scale mt-3 flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-primary text-lg font-bold text-primary-foreground"
            >
              <Plus className="h-6 w-6" />
              {addLabel}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
