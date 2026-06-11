import Link from "next/link";
import { Calendar, Camera, CheckCircle, HardHat } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    href: "/sites",
    label: "現場を見る",
    desc: "作業の完了登録",
    icon: HardHat,
    color: "bg-blue-100 text-blue-800",
  },
  {
    href: "/sites",
    label: "写真を撮る",
    desc: "現場の写真登録",
    icon: Camera,
    color: "bg-green-100 text-green-800",
  },
  {
    href: "/schedule",
    label: "今日の予定",
    desc: "スケジュール確認",
    icon: Calendar,
    color: "bg-amber-100 text-amber-800",
  },
  {
    href: "/workers",
    label: "メンバー",
    desc: "担当者の確認",
    icon: CheckCircle,
    color: "bg-purple-100 text-purple-800",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map(({ href, label, desc, icon: Icon, color }) => (
        <Link key={label} href={href} className="tap-scale">
          <Card className="h-full border-2 active:border-primary">
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${color}`}>
                <Icon className="h-7 w-7" />
              </div>
              <p className="text-lg font-bold">{label}</p>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
