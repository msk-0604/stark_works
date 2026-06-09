"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { completeTask } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@/lib/types/database";

interface NextTasksProps {
  siteId: string;
  tasks: Task[];
}

export function NextTasks({ siteId, tasks }: NextTasksProps) {
  const router = useRouter();
  const [items, setItems] = useState(tasks);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (items.length === 0) return null;

  async function handleComplete(taskId: string) {
    setLoadingId(taskId);
    await completeTask(taskId, siteId);
    setItems((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, is_completed: true, completed_at: new Date().toISOString() } : t
      )
    );
    setLoadingId(null);
    router.refresh();
  }

  return (
    <Card className="border-2 border-primary bg-accent/30 shadow-lg" id="tasks">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">次の作業</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-4 rounded-xl border-2 p-5 ${
              task.is_completed
                ? "border-green-300 bg-green-50"
                : "border-slate-400 bg-white"
            }`}
          >
            <span className="text-3xl leading-none" aria-hidden>
              {task.is_completed ? "☑" : "⬜"}
            </span>
            <span
              className={`flex-1 text-xl font-bold ${
                task.is_completed ? "text-muted-foreground line-through" : "text-foreground"
              }`}
            >
              {task.title}
            </span>
            {!task.is_completed && (
              <Button
                size="lg"
                className="min-h-[68px] shrink-0 px-6 text-lg tap-scale"
                data-task-complete={task.id}
                onClick={() => handleComplete(task.id)}
                disabled={loadingId === task.id}
              >
                完了
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
