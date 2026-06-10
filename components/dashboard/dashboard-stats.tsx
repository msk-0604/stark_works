import { CheckCircle2, HardHat, PlayCircle } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";

interface DashboardStatsProps {
  todaySites: number;
  inProgressSites: number;
  completedSites: number;
}

export function DashboardStats({
  todaySites,
  inProgressSites,
  completedSites,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard title="本日の現場" value={todaySites} icon={HardHat} href="/sites" />
      <StatCard title="進行中" value={inProgressSites} icon={PlayCircle} href="/sites" />
      <StatCard title="完了" value={completedSites} icon={CheckCircle2} href="/sites" />
    </div>
  );
}
