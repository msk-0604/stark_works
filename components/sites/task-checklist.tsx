"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { completeTask, createTask } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Task } from "@/lib/types/database";
import { backgroundRefresh } from "@/lib/utils/refresh";

interface TaskChecklistProps {
  siteId: string;
  initialTasks: Task[];
  onTasksChange?: (tasks: Task[]) => void;
}

export function TaskChecklist({ siteId, initialTasks, onTasksChange }: TaskChecklistProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function updateTasks(updater: (prev: Task[]) => Task[]) {
    setTasks((prev) => {
      const next = updater(prev);
      onTasksChange?.(next);
      return next;
    });
  }

  async function handleComplete(taskId: string) {
    const previous = tasks;
    updateTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, is_completed: true, completed_at: new Date().toISOString() } : t
      )
    );
    setLoadingId(taskId);

    const result = await completeTask(taskId, siteId);
    if (!result.success) {
      updateTasks(() => previous);
    } else {
      backgroundRefresh(router);
    }
    setLoadingId(null);
  }

  async function handleAdd() {
    if (!newTitle.trim()) return;
    const title = newTitle.trim();
    setNewTitle("");
    setLoadingId("add");

    const result = await createTask(siteId, title);
    if (result.success) {
      updateTasks((prev) => [...prev, result.data]);
      backgroundRefresh(router);
    } else {
      setNewTitle(title);
    }
    setLoadingId(null);
  }

  return (
    <div className="space-y-3" id="tasks">
      {tasks.length === 0 && (
        <p className="py-4 text-center text-lg text-muted-foreground">作業が登録されていません</p>
      )}

      {tasks.map((task) => (
        <button
          key={task.id}
          type="button"
          data-task-complete={task.id}
          onClick={() => !task.is_completed && handleComplete(task.id)}
          disabled={task.is_completed || loadingId === task.id}
          className={`tap-scale flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left ${
            task.is_completed
              ? "border-green-300 bg-green-50"
              : "border-slate-300 bg-white active:border-primary"
          }`}
        >
          <span className="shrink-0 text-4xl leading-none">
            {task.is_completed ? "☑" : loadingId === task.id ? "…" : "☐"}
          </span>
          <span
            className={`flex-1 text-xl font-bold ${
              task.is_completed ? "text-muted-foreground line-through" : ""
            }`}
          >
            {task.title}
          </span>
          {!task.is_completed && (
            <span className="shrink-0 rounded-lg bg-primary px-4 py-2 text-lg font-bold text-primary-foreground">
              完了
            </span>
          )}
        </button>
      ))}

      <details className="rounded-xl border-2 border-dashed border-border p-4">
        <summary className="cursor-pointer text-lg font-bold">作業を追加する</summary>
        <div className="mt-3 space-y-3">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="作業名（例: 給水工事）"
            className="h-14 text-lg"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button
            size="lg"
            onClick={handleAdd}
            disabled={!newTitle.trim() || loadingId === "add"}
            className="w-full min-h-[56px] text-lg tap-scale"
          >
            <Plus className="mr-2 h-6 w-6" />
            {loadingId === "add" ? "追加中..." : "追加"}
          </Button>
        </div>
      </details>
    </div>
  );
}
