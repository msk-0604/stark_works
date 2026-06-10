"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { createSchedule } from "@/lib/actions/schedules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Site, Worker } from "@/lib/types/database";
import { formatDateJa } from "@/lib/utils/date";

const STEPS = ["日付", "作業員", "現場", "作業内容", "時間", "保存"] as const;

interface ScheduleFormWizardProps {
  sites: Site[];
  workers: Worker[];
  defaultDate?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ScheduleFormWizard({
  sites,
  workers,
  defaultDate,
  onSuccess,
  onCancel,
}: ScheduleFormWizardProps) {
  const today = new Date().toISOString().split("T")[0];
  const [step, setStep] = useState(0);
  const [date, setDate] = useState(defaultDate ?? today);
  const [workerId, setWorkerId] = useState("");
  const [siteId, setSiteId] = useState("");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedWorker = workers.find((w) => w.id === workerId);
  const selectedSite = sites.find((s) => s.id === siteId);

  function next() {
    setError(null);
    if (step === 0 && !date) {
      setError("日付を選んでください");
      return;
    }
    if (step === 1 && !workerId) {
      setError("作業員を選んでください");
      return;
    }
    if (step === 2 && !siteId) {
      setError("現場を選んでください");
      return;
    }
    if (step === 3 && !title.trim()) {
      setError("作業内容を入力してください");
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function prev() {
    setError(null);
    if (step > 0) setStep(step - 1);
    else onCancel?.();
  }

  async function handleSave() {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("date", date);
    formData.set("worker_id", workerId);
    formData.set("site_id", siteId);
    formData.set("title", title);
    formData.set("start_time", startTime);
    formData.set("end_time", endTime);

    const result = await createSchedule(formData);
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4 rounded-2xl border-2 border-primary bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-muted-foreground">
          ステップ {step + 1} / {STEPS.length}
        </p>
        <p className="text-xl font-bold text-primary">{STEPS[step]}</p>
      </div>

      <div className="flex gap-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-slate-200"}`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-3">
          <p className="text-xl font-bold">いつの予定ですか？</p>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-16 text-2xl"
          />
          <p className="text-lg text-muted-foreground">{formatDateJa(date)}</p>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-xl font-bold">誰の予定ですか？</p>
          <div className="space-y-2">
            {workers.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setWorkerId(w.id)}
                className={`tap-scale w-full rounded-xl border-2 p-4 text-left text-xl font-bold ${
                  workerId === w.id
                    ? "border-primary bg-primary/10"
                    : "border-slate-300 bg-white"
                }`}
              >
                {w.full_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-xl font-bold">どの現場ですか？</p>
          <div className="space-y-2">
            {sites.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSiteId(s.id)}
                className={`tap-scale w-full rounded-xl border-2 p-4 text-left ${
                  siteId === s.id
                    ? "border-primary bg-primary/10"
                    : "border-slate-300 bg-white"
                }`}
              >
                <p className="text-xl font-bold">{s.name}</p>
                {s.address && (
                  <p className="mt-1 text-lg text-muted-foreground">{s.address}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <p className="text-xl font-bold">何の作業ですか？</p>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 給水工事"
            className="h-16 text-xl"
            autoFocus
          />
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <p className="text-xl font-bold">何時から何時までですか？</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-2 text-lg font-semibold">開始</p>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-16 text-xl"
              />
            </div>
            <div>
              <p className="mb-2 text-lg font-semibold">終了</p>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-16 text-xl"
              />
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4 rounded-xl border-2 border-slate-300 bg-slate-50 p-5">
          <p className="text-xl font-bold">内容を確認して保存</p>
          <dl className="space-y-3 text-lg">
            <div>
              <dt className="font-bold text-muted-foreground">日付</dt>
              <dd className="text-xl font-bold">{formatDateJa(date)}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted-foreground">作業員</dt>
              <dd className="text-xl font-bold">{selectedWorker?.full_name}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted-foreground">現場</dt>
              <dd className="text-xl font-bold">{selectedSite?.name}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted-foreground">作業内容</dt>
              <dd className="text-xl font-bold">{title}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted-foreground">時間</dt>
              <dd className="text-xl font-bold">
                {startTime} 〜 {endTime}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-lg font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={prev}
          className="min-h-[64px] text-lg"
        >
          <ChevronLeft className="mr-1 h-6 w-6" />
          {step === 0 ? "やめる" : "戻る"}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" size="lg" onClick={next} className="min-h-[64px] text-lg">
            次へ
            <ChevronRight className="ml-1 h-6 w-6" />
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            onClick={handleSave}
            disabled={loading}
            className="min-h-[64px] text-lg"
          >
            {loading ? "保存中..." : "保存する"}
          </Button>
        )}
      </div>
    </div>
  );
}
