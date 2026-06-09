"use client";

import { useState } from "react";

import { PRESET_QUALIFICATIONS } from "@/lib/constants/qualifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Worker } from "@/lib/types/database";

interface WorkerFormProps {
  action: (formData: FormData) => Promise<{ success: boolean; error?: string } | void>;
  worker?: Worker;
  submitLabel: string;
}

export function WorkerForm({ action, worker, submitLabel }: WorkerFormProps) {
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
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-lg">氏名 *</Label>
        <Input id="full_name" name="full_name" defaultValue={worker?.full_name} required placeholder="山田 太郎" className="text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-lg">電話番号</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={worker?.phone ?? ""} placeholder="090-1234-5678" className="text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-lg">メールアドレス</Label>
        <Input id="email" name="email" type="email" defaultValue={worker?.email ?? ""} placeholder="example@company.co.jp" className="text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position" className="text-lg">役職</Label>
        <Input id="position" name="position" defaultValue={worker?.position ?? ""} placeholder="配管工" className="text-lg" />
      </div>

      <fieldset className="space-y-3 rounded-xl border-2 border-slate-300 p-4">
        <legend className="px-2 text-lg font-bold">保有資格</legend>
        <p className="text-base text-muted-foreground">該当する資格をタップして選択してください</p>
        <div className="space-y-2">
          {PRESET_QUALIFICATIONS.map((qualification) => (
            <label
              key={qualification}
              className="flex min-h-[56px] cursor-pointer items-center gap-4 rounded-xl border-2 border-slate-200 bg-white px-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="checkbox"
                name="qualifications"
                value={qualification}
                defaultChecked={worker?.qualifications?.includes(qualification)}
                className="h-6 w-6 shrink-0 accent-primary"
              />
              <span className="text-lg font-semibold">{qualification}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-base font-medium text-destructive">{error}</p>
      )}

      <Button type="submit" size="lg" className="w-full min-h-[72px] text-xl tap-scale" disabled={loading}>
        {loading ? "保存中..." : submitLabel}
      </Button>
    </form>
  );
}
