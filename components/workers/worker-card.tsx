import Link from "next/link";
import { Award, HardHat, Pencil, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkerWithOverview } from "@/lib/types/database";
import { formatTimeRange } from "@/lib/utils/date";

interface WorkerCardProps {
  worker: WorkerWithOverview;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const todaySiteNames = [...new Set(worker.today_schedules.map((s) => s.site_name))];

  return (
    <Card className="border-2 border-slate-400 shadow-md">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-2xl leading-tight">{worker.full_name}</CardTitle>
          <Button variant="outline" size="lg" className="min-h-[56px] shrink-0 tap-scale" asChild>
            <Link href={`/workers/${worker.id}/edit`}>
              <Pencil className="mr-1 h-5 w-5" />
              編集
            </Link>
          </Button>
        </div>

        {worker.qualifications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {worker.qualifications.map((q) => (
              <span
                key={q}
                className="flex items-center gap-1.5 rounded-lg border-2 border-slate-300 bg-slate-50 px-3 py-1.5 text-base font-semibold"
              >
                <Award className="h-4 w-4 shrink-0" />
                {q}
              </span>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {todaySiteNames.length > 0 ? (
          <div className="rounded-xl border-2 border-primary bg-primary/5 p-4">
            <p className="flex items-center gap-2 text-lg font-bold text-primary">
              <HardHat className="h-6 w-6" />
              今日の現場
            </p>
            {todaySiteNames.map((name) => (
              <p key={name} className="mt-2 text-xl font-bold">
                {name}
              </p>
            ))}
            {worker.today_schedules.map((schedule) => (
              <Link
                key={schedule.id}
                href={`/sites/${schedule.site_id}`}
                className="tap-scale mt-3 block rounded-lg border-2 border-slate-200 bg-white p-3"
              >
                <p className="text-lg font-bold text-primary">
                  {formatTimeRange(schedule.start_time, schedule.end_time)}
                </p>
                <p className="mt-1 text-lg">{schedule.title}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border-2 border-dashed border-slate-300 py-6 text-center text-lg text-muted-foreground">
            本日の予定はありません
          </p>
        )}

        {worker.phone ? (
          <a
            href={`tel:${worker.phone.replace(/-/g, "")}`}
            className="tap-scale flex min-h-[72px] w-full items-center justify-center gap-3 rounded-xl bg-blue-700 text-xl font-bold text-white active:bg-blue-800"
          >
            <Phone className="h-8 w-8" strokeWidth={2.5} />
            電話する
          </a>
        ) : (
          <p className="rounded-xl border-2 border-dashed border-slate-300 py-4 text-center text-lg text-muted-foreground">
            電話番号が未登録です
          </p>
        )}
      </CardContent>
    </Card>
  );
}
