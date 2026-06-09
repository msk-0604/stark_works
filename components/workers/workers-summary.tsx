import type { WorkerWithOverview } from "@/lib/types/database";

interface WorkersSummaryProps {
  workers: WorkerWithOverview[];
}

export function WorkersSummary({ workers }: WorkersSummaryProps) {
  const activeToday = workers.filter((w) => w.today_schedule_count > 0).length;
  const totalSchedules = workers.reduce((sum, w) => sum + w.today_schedule_count, 0);

  const busiest = [...workers]
    .filter((w) => w.today_schedule_count > 0)
    .sort((a, b) => b.today_schedule_count - a.today_schedule_count)[0];

  return (
    <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-5">
      <p className="text-xl font-bold leading-relaxed">
        今日は <span className="text-primary">{activeToday}名</span> が現場に出ています
      </p>
      <p className="mt-2 text-lg">
        本日の予定は合計 <span className="font-bold">{totalSchedules}件</span>
      </p>
      {busiest && (
        <p className="mt-1 text-lg text-muted-foreground">
          最多は <span className="font-bold text-foreground">{busiest.full_name}</span>
          （{busiest.today_schedule_count}件）
        </p>
      )}
    </div>
  );
}
