import Link from "next/link";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ホーム</h1>
        <p className="mt-1 text-xl text-muted-foreground">今日の現場の状況</p>
      </div>

      <TodaySchedule schedules={todaySchedules} />

      <ProgressRanking sites={ranking} />

      <div>
        <h2 className="mb-3 text-lg font-bold text-muted-foreground">サマリー</h2>
        <DashboardStats {...stats} />
      </div>

      <Button asChild size="lg" className="w-full tap-scale">
        <Link href="/sites">現場一覧を見る</Link>
      </Button>
    </div>
  );
}
