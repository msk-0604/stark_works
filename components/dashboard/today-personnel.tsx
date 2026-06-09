import Link from "next/link";
import { Clock, HardHat, User } from "lucide-react";

import { QuickContactButtons } from "@/components/shared/quick-contact-buttons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TodayPersonnel } from "@/lib/types/database";
import { formatTimeRange } from "@/lib/utils/date";

interface TodayPersonnelProps {
  personnel: TodayPersonnel[];
}

export function TodayPersonnelBoard({ personnel }: TodayPersonnelProps) {
  return (
    <Card className="border-2 border-slate-400 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <User className="h-7 w-7 text-primary" />
          今日の人員配置
        </CardTitle>
        <p className="text-lg text-muted-foreground">誰がどの現場にいるか</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {personnel.length === 0 ? (
          <p className="py-4 text-center text-lg text-muted-foreground">本日の配置はありません</p>
        ) : (
          personnel.map((person) => (
            <div
              key={person.worker_id}
              className="rounded-xl border-2 border-primary/30 bg-white p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-2xl font-bold text-primary">{person.worker_name}</p>
                <span className="rounded-lg bg-primary/10 px-3 py-1 text-lg font-bold text-primary">
                  {person.assignments.length}件
                </span>
              </div>

              <QuickContactButtons
                phone={person.worker_phone}
                className="mt-3"
                phoneLabel="電話する"
              />

              <div className="mt-3 space-y-2">
                {person.assignments.map((a) => (
                  <Link
                    key={a.schedule_id}
                    href={`/sites/${a.site_id}`}
                    className="tap-scale block rounded-lg border-2 border-slate-200 bg-slate-50 p-4 active:border-primary"
                  >
                    <p className="flex items-center gap-2 text-lg font-bold">
                      <Clock className="h-5 w-5 shrink-0" />
                      {formatTimeRange(a.start_time, a.end_time)}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xl font-bold">
                      <HardHat className="h-5 w-5 shrink-0 text-primary" />
                      {a.site_name}
                    </p>
                    <p className="mt-2 text-lg font-semibold">{a.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
