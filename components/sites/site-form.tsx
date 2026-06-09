"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE_STATUS_LABELS, type Site, type SiteStatus } from "@/lib/types/database";
import type { Worker } from "@/lib/types/database";

interface SiteFormProps {
  action: (formData: FormData) => Promise<{ success: boolean; error?: string } | void>;
  site?: Site;
  workers: Worker[];
  submitLabel: string;
}

const selectClassName =
  "flex h-13 min-h-[52px] w-full rounded-lg border-2 border-input bg-card px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SiteForm({ action, site, workers, submitLabel }: SiteFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await action(formData);
    if (result && "success" in result && !result.success) {
      setError(result.error ?? "エラーが発生しました");
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">現場名 *</Label>
        <Input id="name" name="name" defaultValue={site?.name} required placeholder="田中邸 給排水工事" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customer_name">顧客名</Label>
        <Input id="customer_name" name="customer_name" defaultValue={site?.customer_name ?? ""} placeholder="田中 一郎" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">住所</Label>
        <Input id="address" name="address" defaultValue={site?.address ?? ""} placeholder="東京都..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">電話番号</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={site?.phone ?? ""} placeholder="03-1234-5678" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_date">工事開始日</Label>
          <Input id="start_date" name="start_date" type="date" defaultValue={site?.start_date ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expected_end_date">完了予定日</Label>
          <Input id="expected_end_date" name="expected_end_date" type="date" defaultValue={site?.expected_end_date ?? ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="manager_id">担当責任者</Label>
        <select id="manager_id" name="manager_id" className={selectClassName} defaultValue={site?.manager_id ?? ""}>
          <option value="">選択してください</option>
          {workers.map((w) => (
            <option key={w.id} value={w.id}>
              {w.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">ステータス</Label>
        <select id="status" name="status" className={selectClassName} defaultValue={site?.status ?? "not_started"}>
          {(Object.keys(SITE_STATUS_LABELS) as SiteStatus[]).map((key) => (
            <option key={key} value={key}>
              {SITE_STATUS_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-base font-medium text-destructive">{error}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "保存中..." : submitLabel}
      </Button>
    </form>
  );
}
