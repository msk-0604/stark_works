import Link from "next/link";
import { Calendar, ChevronRight, Clock, HardHat, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Schedule } from "@/lib/types/database";
import { formatTimeRange, getTodayLabel } from "@/lib/utils/date";

interface TodayScheduleProps {
  schedules: Schedule[];
}

export function TodaySchedule({ schedules }: TodayScheduleProps) {
  return (
    <Card className="border-2 border-primary shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="h-7 w-7 text-primary" />
            本日の予定
          </CardTitle>
          <span className="shrink-0 rounded-lg bg-primary px-3 py-1 text-base font-bold text-primary-foreground">
            {schedules.length}件
          </span>
        </div>
        <p className="text-lg text-muted-foreground">{getTodayLabel()}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedules.length === 0 ? (
          <p className="py-6 text-center text-lg text-muted-foreground">本日の予定はありません</p>
        ) : (
          schedules.map((s) => (
            <Link
              key={s.id}
              href={`/sites/${s.site_id}`}
              className="tap-scale block rounded-xl border-2 border-slate-300 bg-white p-5 active:border-primary"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-xl font-bold text-primary">
                    <User className="h-6 w-6 shrink-0" />
                    {s.worker?.full_name ?? "作業員"}
                  </p>
                  <p className="flex items-center gap-2 text-lg font-semibold">
                    <Clock className="h-5 w-5 shrink-0 text-muted-foreground" />
                    {formatTimeRange(s.start_time, s.end_time)}
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <HardHat className="h-5 w-5 shrink-0 text-muted-foreground" />
                    {s.site?.name ?? "現場"}
                  </p>
                  <p className="rounded-lg bg-slate-100 px-3 py-2 text-lg font-semibold">
                    {s.title}
                  </p>
                </div>
                <ChevronRight className="mt-1 h-7 w-7 shrink-0 text-primary" />
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
