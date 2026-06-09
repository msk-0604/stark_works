import Link from "next/link";
import {
  Award,
  Calendar,
  ChevronRight,
  Clock,
  HardHat,
  History,
  Pencil,
  Phone,
} from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkerWithOverview } from "@/lib/types/database";
import { formatDateJa, formatTimeRange } from "@/lib/utils/date";

interface WorkerCardProps {
  worker: WorkerWithOverview;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const todaySiteNames = [...new Set(worker.today_schedules.map((s) => s.site_name))];

  return (
    <Card className="border-2 border-slate-400 shadow-md">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-2xl leading-tight">{worker.full_name}</CardTitle>
            {worker.position && (
              <p className="mt-1 text-lg font-semibold text-muted-foreground">{worker.position}</p>
            )}
          </div>
          <Button variant="outline" size="lg" className="min-h-[56px] shrink-0 tap-scale" asChild>
            <Link href={`/workers/${worker.id}/edit`}>
              <Pencil className="mr-1 h-5 w-5" />
              編集
            </Link>
          </Button>
        </div>

        {worker.qualifications.length > 0 && (
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-base font-bold text-muted-foreground">
              <Award className="h-5 w-5" />
              保有資格
            </p>
            <div className="flex flex-wrap gap-2">
              {worker.qualifications.map((q) => (
                <span
                  key={q}
                  className="rounded-lg border-2 border-blue-300 bg-blue-50 px-3 py-1.5 text-base font-semibold text-blue-900"
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-5">
        {/* 本日の予定件数 + 担当現場 */}
        <div className="rounded-xl border-2 border-primary bg-primary/5 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-xl font-bold">
              <Calendar className="h-6 w-6 text-primary" />
              本日の予定
            </p>
            <span className="rounded-lg bg-primary px-4 py-1.5 text-xl font-bold text-primary-foreground">
              {worker.today_schedule_count}件
            </span>
          </div>

          {todaySiteNames.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-base font-bold text-muted-foreground">担当現場</p>
              {todaySiteNames.map((name) => (
                <p key={name} className="flex items-center gap-2 text-lg font-semibold">
                  <HardHat className="h-5 w-5 shrink-0 text-primary" />
                  {name}
                </p>
              ))}
            </div>
          )}

          {worker.today_schedules.length === 0 ? (
            <p className="mt-3 text-lg text-muted-foreground">本日の予定はありません</p>
          ) : (
            <div className="mt-3 space-y-2">
              {worker.today_schedules.map((schedule) => (
                <Link
                  key={schedule.id}
                  href={`/sites/${schedule.site_id}`}
                  className="tap-scale block rounded-lg border-2 border-slate-300 bg-white p-4 active:border-primary"
                >
                  <p className="flex items-center gap-2 text-lg font-bold">
                    <Clock className="h-5 w-5 shrink-0 text-muted-foreground" />
                    {formatTimeRange(schedule.start_time, schedule.end_time)}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{schedule.site_name}</p>
                  <p className="mt-1 rounded-lg bg-slate-100 px-3 py-2 text-lg">{schedule.title}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ワンタップ電話 */}
        {worker.phone ? (
          <a
            href={`tel:${worker.phone.replace(/-/g, "")}`}
            className="tap-scale flex min-h-[72px] w-full items-center justify-center gap-3 rounded-xl bg-blue-700 text-xl font-bold text-white active:bg-blue-800"
          >
            <Phone className="h-8 w-8" strokeWidth={2.5} />
            電話する（{worker.phone}）
          </a>
        ) : (
          <p className="rounded-xl border-2 border-dashed border-slate-300 py-4 text-center text-lg text-muted-foreground">
            電話番号が未登録です
          </p>
        )}

        {/* 担当履歴 */}
        {worker.site_history.length > 0 && (
          <details className="group rounded-xl border-2 border-slate-300 bg-slate-50">
            <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-2 p-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <History className="h-6 w-6 text-primary" />
                担当現場の履歴（{worker.site_history.length}件）
              </span>
              <ChevronRight className="h-6 w-6 shrink-0 transition-transform group-open:rotate-90" />
            </summary>
            <div className="space-y-2 border-t-2 border-slate-300 p-4 pt-2">
              {worker.site_history.map((history) => (
                <Link
                  key={history.site_id}
                  href={`/sites/${history.site_id}`}
                  className="tap-scale flex items-center justify-between gap-3 rounded-lg border-2 border-slate-200 bg-white p-4 active:border-primary"
                >
                  <div className="min-w-0">
                    <p className="text-lg font-bold leading-snug">{history.site_name}</p>
                    <p className="mt-1 text-base text-muted-foreground">
                      担当開始: {formatDateJa(history.assigned_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <StatusBadge status={history.site_status} />
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
}
