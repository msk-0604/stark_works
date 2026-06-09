import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Schedule } from "@/lib/types/database";
import { formatTimeRange, getTodayLabel } from "@/lib/utils/date";

interface TodayScheduleProps {
  schedules: Schedule[];
}

export function TodaySchedule({ schedules }: TodayScheduleProps) {
  return (
    <Card className="border-2 border-primary/40 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="h-7 w-7 text-primary" />
            本日の予定
          </CardTitle>
          <span className="text-base font-semibold text-muted-foreground">{getTodayLabel()}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedules.length === 0 ? (
          <p className="py-4 text-center text-lg text-muted-foreground">本日の予定はありません</p>
        ) : (
          schedules.map((s) => (
            <Link
              key={s.id}
              href={`/sites/${s.site_id}`}
              className="tap-scale block rounded-xl border-2 border-border bg-card p-4 active:border-primary"
            >
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-primary">{s.worker?.full_name ?? "作業員"}</p>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-1 text-lg font-semibold">{formatTimeRange(s.start_time, s.end_time)}</p>
              <p className="mt-2 text-lg">{s.site?.name ?? "現場"}</p>
              <p className="text-base text-muted-foreground">{s.title}</p>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
