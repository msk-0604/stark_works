"use client";

import { useState } from "react";

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
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="full_name">氏名 *</Label>
        <Input id="full_name" name="full_name" defaultValue={worker?.full_name} required placeholder="山田 太郎" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">電話番号</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={worker?.phone ?? ""} placeholder="090-1234-5678" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input id="email" name="email" type="email" defaultValue={worker?.email ?? ""} placeholder="example@company.co.jp" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">役職</Label>
        <Input id="position" name="position" defaultValue={worker?.position ?? ""} placeholder="配管工" />
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
