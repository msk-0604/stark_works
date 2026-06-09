"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, Trash2 } from "lucide-react";

import { completeTask, createTask, deleteTask } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Task } from "@/lib/types/database";

interface TaskChecklistProps {
  siteId: string;
  initialTasks: Task[];
}

export function TaskChecklist({ siteId, initialTasks }: TaskChecklistProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleComplete(taskId: string) {
    setLoadingId(taskId);
    await completeTask(taskId, siteId);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, is_completed: true, completed_at: new Date().toISOString() } : t
      )
    );
    setLoadingId(null);
    router.refresh();
  }

  async function handleAdd() {
    if (!newTitle.trim()) return;
    const result = await createTask(siteId, newTitle);
    if (result.success) {
      setTasks((prev) => [...prev, result.data]);
      setNewTitle("");
      router.refresh();
    }
  }

  async function handleDelete(taskId: string) {
    setLoadingId(taskId);
    await deleteTask(taskId, siteId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setLoadingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 && (
        <p className="text-lg text-muted-foreground">作業が登録されていません</p>
      )}

      {tasks.map((task) => (
        <div
          key={task.id}
          className="rounded-xl border-2 border-border bg-card p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <p className={`flex-1 text-xl font-bold leading-snug ${task.is_completed ? "text-muted-foreground line-through" : ""}`}>
              {task.title}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 shrink-0 tap-scale"
              onClick={() => handleDelete(task.id)}
              disabled={loadingId === task.id}
              aria-label="削除"
            >
              <Trash2 className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          {task.is_completed && task.completed_at && (
            <p className="mt-2 text-base text-muted-foreground">
              完了: {new Date(task.completed_at).toLocaleString("ja-JP")}
              {task.completed_worker && ` / ${task.completed_worker.full_name}`}
            </p>
          )}

          <div className="mt-3">
            {!task.is_completed ? (
            <Button
              size="lg"
              data-task-complete={task.id}
              onClick={() => handleComplete(task.id)}
              disabled={loadingId === task.id}
              className="w-full text-xl tap-scale"
            >
                <Check className="mr-2 h-7 w-7" />
                完了
              </Button>
            ) : (
              <div className="flex w-full items-center justify-center rounded-xl bg-green-100 py-4 text-lg font-bold text-green-800">
                完了済み
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="space-y-3 rounded-xl border-2 border-dashed border-border p-4">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="作業名（例: 給水工事）"
          className="text-lg"
        />
        <Button size="lg" onClick={handleAdd} disabled={!newTitle.trim()} className="w-full text-lg tap-scale">
          <Plus className="mr-2 h-6 w-6" />
          作業を追加
        </Button>
      </div>
    </div>
  );
}
