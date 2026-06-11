"use client";

import { useState } from "react";

import { deleteWorker } from "@/lib/actions/workers";
import { Button } from "@/components/ui/button";

interface DeleteWorkerButtonProps {
  workerId: string;
  workerName: string;
}

export function DeleteWorkerButton({ workerId, workerName }: DeleteWorkerButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`「${workerName}」を削除しますか？`)) return;
    setLoading(true);
    await deleteWorker(workerId);
  }

  return (
    <Button variant="destructive" size="lg" onClick={handleDelete} disabled={loading} className="w-full">
      {loading ? "削除中..." : "このメンバーを削除"}
    </Button>
  );
}
