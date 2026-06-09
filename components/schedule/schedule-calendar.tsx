"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

import { deleteSchedule } from "@/lib/actions/schedules";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Schedule } from "@/lib/types/database";
import type { Site } from "@/lib/types/database";
import type { Worker } from "@/lib/types/database";
import {
  formatDate,
  formatDateJa,
  formatDateTimeJa,
  getMonthDates,
  getWeekDates,
  WEEKDAY_LABELS,
} from "@/lib/utils/date";
import { ScheduleForm } from "@/components/schedule/schedule-form";

type ViewMode = "day" | "week" | "month";

interface ScheduleCalendarProps {
  schedules: Schedule[];
  sites: Site[];
  workers: Worker[];
}

export function ScheduleCalendar({ schedules, sites, workers }: ScheduleCalendarProps) {
  const router = useRouter();
  const [view, setView] = useState<ViewMode>("week");
  const [current, setCurrent] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const today = formatDate(new Date());

  const filteredSchedules = useMemo(() => {
    if (view === "day") {
      return schedules.filter((s) => s.start_time.startsWith(selectedDate));
    }
    if (view === "week") {
      const weekDates = getWeekDates(current).map(formatDate);
      return schedules.filter((s) => weekDates.some((d) => s.start_time.startsWith(d)));
    }
    const ym = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
    return schedules.filter((s) => s.start_time.startsWith(ym));
  }, [schedules, view, current, selectedDate]);

  function prev() {
    const d = new Date(current);
    if (view === "month") d.setMonth(d.getMonth() - 1);
    else if (view === "week") d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrent(d);
    setSelectedDate(formatDate(d));
  }

  function next() {
    const d = new Date(current);
    if (view === "month") d.setMonth(d.getMonth() + 1);
    else if (view === "week") d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrent(d);
    setSelectedDate(formatDate(d));
  }

  async function handleDelete(id: string) {
    if (!confirm("この予定を削除しますか？")) return;
    await deleteSchedule(id);
    router.refresh();
  }

  const monthWeeks = view === "month" ? getMonthDates(current.getFullYear(), current.getMonth()) : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {(["day", "week", "month"] as ViewMode[]).map((v) => (
          <Button
            key={v}
            size="lg"
            variant={view === v ? "default" : "outline"}
            className="text-lg"
            onClick={() => setView(v)}
          >
            {v === "day" ? "日" : v === "week" ? "週" : "月"}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" className="h-12 w-12" onClick={prev} aria-label="前へ">
          <ChevronLeft className="h-7 w-7" />
        </Button>
        <p className="text-xl font-bold">
          {view === "month"
            ? `${current.getFullYear()}年${current.getMonth() + 1}月`
            : formatDateJa(selectedDate)}
        </p>
        <Button variant="outline" size="icon" className="h-12 w-12" onClick={next} aria-label="次へ">
          <ChevronRight className="h-7 w-7" />
        </Button>
      </div>

      {view === "month" && (
        <div className="overflow-hidden rounded-xl border-2 border-border">
          <div className="grid grid-cols-7 bg-muted">
            {WEEKDAY_LABELS.map((d) => (
              <div key={d} className="p-2 text-center text-sm font-bold">{d}</div>
            ))}
          </div>
          {monthWeeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-t border-border">
              {week.map((date, di) => {
                if (!date) return <div key={di} className="min-h-[72px] bg-muted/30" />;
                const ds = formatDate(date);
                const dayEvents = schedules.filter((s) => s.start_time.startsWith(ds));
                const isToday = ds === today;
                return (
                  <button
                    key={di}
                    type="button"
                    onClick={() => { setSelectedDate(ds); setView("day"); }}
                    className={`tap-scale min-h-[72px] border-r border-border p-2 text-left last:border-r-0 active:bg-accent ${isToday ? "bg-accent" : ""}`}
                  >
                    <span className={`text-lg font-bold ${isToday ? "text-primary" : ""}`}>{date.getDate()}</span>
                    {dayEvents.length > 0 && (
                      <span className="mt-1 block rounded bg-primary px-1.5 py-0.5 text-sm font-bold text-white">{dayEvents.length}件</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <Button size="lg" className="w-full text-lg" onClick={() => setShowForm(!showForm)}>
        <Plus className="mr-2 h-6 w-6" />
        予定を追加
      </Button>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <ScheduleForm
              sites={sites}
              workers={workers}
              defaultDate={selectedDate}
              onSuccess={() => { setShowForm(false); router.refresh(); }}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <p className="text-lg font-bold">予定一覧（{filteredSchedules.length}件）</p>
        {filteredSchedules.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-lg text-muted-foreground">
            予定がありません
          </p>
        ) : (
          filteredSchedules.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex-1">
                  <p className="text-xl font-bold">{s.title}</p>
                  <p className="mt-1 text-base text-muted-foreground">
                    {formatDateTimeJa(s.start_time)} 〜 {formatDateTimeJa(s.end_time)}
                  </p>
                  <p className="mt-1 text-base">
                    {s.site?.name} / {s.worker?.full_name}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12" onClick={() => handleDelete(s.id)} aria-label="削除">
                  <Trash2 className="h-6 w-6 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
