import { CheckCircle2, HardHat, PlayCircle, Users } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";

interface DashboardStatsProps {
  todaySites: number;
  inProgressSites: number;
  completedSites: number;
  workerCount: number;
}

export function DashboardStats({
  todaySites,
  inProgressSites,
  completedSites,
  workerCount,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatCard title="本日の現場" value={todaySites} icon={HardHat} href="/sites" />
      <StatCard title="作業中" value={inProgressSites} icon={PlayCircle} href="/sites" />
      <StatCard title="完了現場" value={completedSites} icon={CheckCircle2} href="/sites" />
      <StatCard title="作業員数" value={workerCount} icon={Users} href="/workers" />
    </div>
  );
}
