"use client";

import { useState } from "react";

import { createSchedule } from "@/lib/actions/schedules";
import { LABELS, TIME_PRESETS, WORK_PRESETS } from "@/lib/constants/labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Site, Worker } from "@/lib/types/database";
import { formatDateJa } from "@/lib/utils/date";

interface ScheduleQuickFormProps {
  sites: Site[];
  workers: Worker[];
  defaultDate?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ScheduleQuickForm({
  sites,
  workers,
  defaultDate,
  onSuccess,
  onCancel,
}: ScheduleQuickFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const date = defaultDate ?? today;
  const [workerId, setWorkerId] = useState("");
  const [siteId, setSiteId] = useState("");
  const [title, setTitle] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [timePreset, setTimePreset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedTime = TIME_PRESETS[timePreset];
  const finalTitle = title === "その他" ? customTitle.trim() : title;

  const canSave = workerId && siteId && finalTitle;

  async function handleSave() {
    if (!canSave) {
      setError(`${LABELS.memberSelect}・現場・作業内容を選んでください`);
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("date", date);
    formData.set("worker_id", workerId);
    formData.set("site_id", siteId);
    formData.set("title", finalTitle);
    formData.set("start_time", selectedTime.start);
    formData.set("end_time", selectedTime.end);

    const result = await createSchedule(formData);
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-5 rounded-2xl border-2 border-primary bg-white p-5">
      <div>
        <p className="text-xl font-bold">予定を追加</p>
        <p className="mt-1 text-lg text-muted-foreground">
          {formatDateJa(date)} · 5タップで完了
        </p>
      </div>

      <section className="space-y-2">
        <p className="text-lg font-bold">① {LABELS.memberShort}</p>
        <div className="grid grid-cols-2 gap-2">
          {workers.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWorkerId(w.id)}
              className={`tap-scale min-h-[64px] rounded-xl border-2 px-3 text-lg font-bold ${
                workerId === w.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-slate-300 bg-white"
              }`}
            >
              {w.full_name}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-lg font-bold">② 現場</p>
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
              <p className="text-lg font-bold">{s.name}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-lg font-bold">③ 作業内容</p>
        <div className="grid grid-cols-2 gap-2">
          {WORK_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setTitle(preset)}
              className={`tap-scale min-h-[56px] rounded-xl border-2 px-2 text-base font-bold ${
                title === preset
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-slate-300 bg-white"
              }`}
            >
              {preset}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setTitle("その他")}
            className={`tap-scale min-h-[56px] rounded-xl border-2 px-2 text-base font-bold ${
              title === "その他"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-slate-300 bg-white"
            }`}
          >
            その他
          </button>
        </div>
        {title === "その他" && (
          <Input
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="作業名を入力"
            className="h-14 text-lg"
            autoFocus
          />
        )}
      </section>

      <section className="space-y-2">
        <p className="text-lg font-bold">④ 時間</p>
        <div className="grid grid-cols-3 gap-2">
          {TIME_PRESETS.map((preset, i) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setTimePreset(i)}
              className={`tap-scale min-h-[64px] rounded-xl border-2 px-2 text-base font-bold ${
                timePreset === i
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-slate-300 bg-white"
              }`}
            >
              {preset.label}
              <span className="mt-1 block text-sm font-normal opacity-80">
                {preset.start}〜{preset.end}
              </span>
            </button>
          ))}
        </div>
      </section>

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
          onClick={onCancel}
          className="min-h-[72px] text-lg"
        >
          やめる
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={handleSave}
          disabled={loading || !canSave}
          className="min-h-[72px] text-xl font-bold"
        >
          {loading ? "保存中..." : "⑤ 登録する"}
        </Button>
      </div>
    </div>
  );
}
