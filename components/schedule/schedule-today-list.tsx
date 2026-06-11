"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

import { ScheduleQuickForm } from "@/components/schedule/schedule-quick-form";
import { LABELS } from "@/lib/constants/labels";
import { deleteSchedule } from "@/lib/actions/schedules";
import { Button } from "@/components/ui/button";
import type { Schedule, Site, Worker } from "@/lib/types/database";
import { formatDate, formatDateJa, formatTimeRange } from "@/lib/utils/date";
import { backgroundRefresh } from "@/lib/utils/refresh";
import { unwrapRelation } from "@/lib/utils/unwrap-relation";

interface ScheduleTodayListProps {
  schedules: Schedule[];
  sites: Site[];
  workers: Worker[];
  defaultShowForm?: boolean;
}

export function ScheduleTodayList({
  schedules,
  sites,
  workers,
  defaultShowForm = false,
}: ScheduleTodayListProps) {
  const router = useRouter();
  const [localSchedules, setLocalSchedules] = useState(schedules);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [showForm, setShowForm] = useState(defaultShowForm);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLocalSchedules(schedules);
  }, [schedules]);

  const today = formatDate(new Date());
  const isToday = selectedDate === today;

  const daySchedules = useMemo(
    () =>
      localSchedules
        .filter((s) => s.start_time.startsWith(selectedDate))
        .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [localSchedules, selectedDate]
  );

  function shiftDay(delta: number) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(formatDate(d));
  }

  async function handleDelete(id: string) {
    if (!confirm("この予定を削除しますか？")) return;
    const previous = localSchedules;
    setLocalSchedules((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(id);

    const result = await deleteSchedule(id);
    if (!result.success) {
      setLocalSchedules(previous);
    } else {
      backgroundRefresh(router);
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border-2 border-slate-300 bg-white p-3">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14"
          onClick={() => shiftDay(-1)}
          aria-label="前の日"
        >
          <ChevronLeft className="h-7 w-7" />
        </Button>
        <div className="text-center">
          <p className="text-2xl font-bold">{formatDateJa(selectedDate)}</p>
          {isToday && (
            <p className="text-lg font-semibold text-primary">今日</p>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14"
          onClick={() => shiftDay(1)}
          aria-label="次の日"
        >
          <ChevronRight className="h-7 w-7" />
        </Button>
      </div>

      {!isToday && (
        <Button
          variant="outline"
          size="lg"
          className="w-full min-h-[56px] text-lg"
          onClick={() => setSelectedDate(today)}
        >
          今日に戻る
        </Button>
      )}

      <Button
        size="lg"
        className="w-full min-h-[72px] text-xl"
        onClick={() => setShowForm(true)}
      >
        <Plus className="mr-2 h-6 w-6" />
        予定を追加
      </Button>

      {showForm && (
        <ScheduleQuickForm
          sites={sites}
          workers={workers}
          defaultDate={selectedDate}
          onSuccess={() => {
            setShowForm(false);
            backgroundRefresh(router);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-3">
        <p className="text-xl font-bold">
          {isToday ? "今日の予定" : "予定一覧"}（{daySchedules.length}件）
        </p>

        {daySchedules.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-xl text-muted-foreground">
            予定がありません
          </p>
        ) : (
          daySchedules.map((s) => {
            const worker = unwrapRelation(s.worker as Worker | Worker[] | null);
            const site = unwrapRelation(s.site as Site | Site[] | null);
            return (
              <div
                key={s.id}
                className={`rounded-xl border-2 border-slate-300 bg-white p-5 transition-opacity ${
                  deletingId === s.id ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-lg text-muted-foreground">
                      {LABELS.memberShort}: {worker?.full_name ?? "—"}
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {formatTimeRange(s.start_time, s.end_time)}
                    </p>
                    <p className="text-xl font-bold">{site?.name ?? "現場"}</p>
                    <p className="rounded-lg bg-slate-100 px-3 py-2 text-xl font-semibold">
                      {s.title}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 shrink-0"
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
                    aria-label="削除"
                  >
                    <Trash2 className="h-6 w-6 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
