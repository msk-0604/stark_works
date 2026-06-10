import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { SimpleDelayNotice } from "@/components/dashboard/simple-delay-notice";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import {
  getDashboardStats,
  getDelayedSites,
  getTodaySchedules,
} from "@/lib/actions/dashboard";
import { getTodayLabel } from "@/lib/utils/date";

export default async function DashboardPage() {
  const [stats, todaySchedules, delayed] = await Promise.all([
    getDashboardStats(),
    getTodaySchedules(),
    getDelayedSites(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">ホーム</h1>
        <p className="mt-1 text-xl text-muted-foreground">{getTodayLabel()}</p>
      </div>

      <DashboardStats
        todaySites={stats.todaySites}
        inProgressSites={stats.inProgressSites}
        completedSites={stats.completedSites}
      />

      <SimpleDelayNotice sites={delayed} />

      <TodaySchedule schedules={todaySchedules} />
    </div>
  );
}
