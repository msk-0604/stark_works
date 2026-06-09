"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Circle } from "lucide-react";

import { completeTask } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@/lib/types/database";

interface TodayTasksProps {
  siteId: string;
  tasks: Task[];
}

export function TodayTasks({ siteId, tasks }: TodayTasksProps) {
  const router = useRouter();
  const [items, setItems] = useState(tasks);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const nextTask = items.find((t) => !t.is_completed);

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

  if (items.length === 0) return null;

  return (
    <Card className="border-2 border-primary bg-accent/20 shadow-md" id="tasks">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">今日やる作業</CardTitle>
        {nextTask && (
          <p className="text-lg">
            次 → <span className="font-bold text-primary">{nextTask.title}</span>
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 rounded-xl border-2 p-4 ${
              task.is_completed ? "border-green-200 bg-green-50" : "border-border bg-card"
            }`}
          >
            {task.is_completed ? (
              <Check className="h-7 w-7 shrink-0 text-green-600" strokeWidth={3} />
            ) : (
              <Circle className="h-7 w-7 shrink-0 text-muted-foreground" strokeWidth={2} />
            )}
            <span
              className={`flex-1 text-xl font-bold ${
                task.is_completed ? "text-muted-foreground line-through" : ""
              }`}
            >
              {task.title}
            </span>
            {!task.is_completed && (
              <Button
                size="lg"
                className="shrink-0 text-lg tap-scale"
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
