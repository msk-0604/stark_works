import Link from "next/link";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { ProgressRanking } from "@/components/dashboard/progress-ranking";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { Button } from "@/components/ui/button";
import { getDashboardStats, getProgressRanking, getTodaySchedules } from "@/lib/actions/dashboard";

export default async function DashboardPage() {
  const [stats, todaySchedules, ranking] = await Promise.all([
    getDashboardStats(),
    getTodaySchedules(),
    getProgressRanking(),
  ]);

  const top = ranking[0];
  const bottom = ranking[ranking.length - 1];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ホーム</h1>
        <p className="mt-1 text-xl text-muted-foreground">今日の現場の状況</p>
      </div>

      <DashboardSummary
        scheduleCount={todaySchedules.length}
        topSiteName={top?.name}
        topProgress={top?.progress_percent}
        laggingSiteName={bottom && bottom.id !== top?.id ? bottom.name : undefined}
        laggingProgress={bottom && bottom.id !== top?.id ? bottom.progress_percent : undefined}
      />

      <DashboardStats {...stats} />

      <TodaySchedule schedules={todaySchedules} />

      <ProgressRanking sites={ranking} />

      <Button asChild size="lg" className="w-full min-h-[68px] text-xl tap-scale">
        <Link href="/sites">現場一覧を見る</Link>
      </Button>
    </div>
  );
}
