import Link from "next/link";
import { Calendar, ChevronRight, HardHat, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Schedule, Site, Worker } from "@/lib/types/database";
import { formatTimeRange } from "@/lib/utils/date";
import { unwrapRelation } from "@/lib/utils/unwrap-relation";

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
          <span className="shrink-0 rounded-lg bg-primary px-4 py-1.5 text-xl font-bold text-primary-foreground">
            {schedules.length}件
          </span>
        </div>
        <p className="text-lg text-muted-foreground">誰が・どこで・何をしているか</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedules.length === 0 ? (
          <p className="py-6 text-center text-lg text-muted-foreground">本日の予定はありません</p>
        ) : (
          schedules.map((s) => {
            const worker = unwrapRelation(s.worker as Worker | Worker[] | null);
            const site = unwrapRelation(s.site as Site | Site[] | null);
            return (
            <div
              key={s.id}
              className="rounded-xl border-2 border-slate-300 bg-white p-4"
            >
              <Link href={`/sites/${s.site_id}`} prefetch className="tap-scale block">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-primary">
                      {formatTimeRange(s.start_time, s.end_time)}
                    </p>
                    <p className="flex items-center gap-2 text-xl font-bold">
                      <User className="h-6 w-6 shrink-0" />
                      {worker?.full_name ?? "作業員"}
                    </p>
                    <p className="flex items-center gap-2 text-xl">
                      <HardHat className="h-6 w-6 shrink-0 text-muted-foreground" />
                      {site?.name ?? "現場"}
                    </p>
                    <p className="rounded-lg bg-slate-100 px-3 py-2 text-xl font-semibold">
                      {s.title}
                    </p>
                  </div>
                  <ChevronRight className="mt-1 h-8 w-8 shrink-0 text-primary" />
                </div>
              </Link>
            </div>
          );
          })
        )}
      </CardContent>
    </Card>
  );
}
