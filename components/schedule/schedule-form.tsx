"use client";

import { useState } from "react";

import { createSchedule } from "@/lib/actions/schedules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Site, Worker } from "@/lib/types/database";

const selectClassName =
  "flex h-14 min-h-[56px] w-full rounded-lg border-2 border-input bg-card px-4 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface ScheduleFormProps {
  sites: Site[];
  workers: Worker[];
  defaultDate?: string;
  onSuccess?: () => void;
}

export function ScheduleForm({ sites, workers, defaultDate, onSuccess }: ScheduleFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createSchedule(formData);
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-lg">作業内容 *</Label>
        <Input id="title" name="title" required placeholder="例: 配管工事" className="text-lg h-14" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="site_id" className="text-lg">現場 *</Label>
        <select id="site_id" name="site_id" className={selectClassName} required>
          <option value="">選んでください</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="worker_id" className="text-lg">担当 *</Label>
        <select id="worker_id" name="worker_id" className={selectClassName} required>
          <option value="">選んでください</option>
          {workers.map((w) => (
            <option key={w.id} value={w.id}>{w.full_name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="text-lg">日付 *</Label>
        <Input id="date" name="date" type="date" required defaultValue={defaultDate} className="text-lg h-14" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="start_time" className="text-lg">開始 *</Label>
          <Input id="start_time" name="start_time" type="time" required defaultValue="09:00" className="text-lg h-14" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time" className="text-lg">終了 *</Label>
          <Input id="end_time" name="end_time" type="time" required defaultValue="17:00" className="text-lg h-14" />
        </div>
      </div>

      {error && <p className="rounded-lg bg-destructive/10 p-3 text-lg font-medium text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="w-full text-lg" disabled={loading}>
        {loading ? "登録中..." : "予定を登録する"}
      </Button>
    </form>
  );
}
