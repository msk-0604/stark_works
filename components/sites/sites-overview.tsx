import { AlertTriangle, HardHat, Users } from "lucide-react";

import type { SiteListItem } from "@/lib/types/database";
import { getTodayLabel } from "@/lib/utils/date";

interface SitesOverviewProps {
  sites: SiteListItem[];
}

export function SitesOverview({ sites }: SitesOverviewProps) {
  const activeToday = sites.filter((s) => s.is_active_today).length;
  const overdue = sites.filter((s) => s.is_overdue).length;
  const inProgress = sites.filter((s) => s.status === "in_progress").length;

  return (
    <section className="rounded-xl border-2 border-primary/40 bg-primary/5 p-5">
      <p className="text-lg font-semibold text-muted-foreground">{getTodayLabel()}</p>
      <p className="mt-1 text-xl font-bold">現場の状況</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border-2 border-slate-300 bg-white p-4">
          <HardHat className="h-9 w-9 shrink-0 text-primary" />
          <div>
            <p className="text-2xl font-bold">{activeToday}現場</p>
            <p className="text-lg font-semibold">今日動いている</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border-2 border-slate-300 bg-white p-4">
          <Users className="h-9 w-9 shrink-0 text-primary" />
          <div>
            <p className="text-2xl font-bold">{inProgress}現場</p>
            <p className="text-lg font-semibold">作業中</p>
          </div>
        </div>

        <div
          className={`flex items-center gap-3 rounded-xl border-2 p-4 ${
            overdue > 0 ? "border-red-400 bg-red-50" : "border-emerald-400 bg-emerald-50"
          }`}
        >
          <AlertTriangle
            className={`h-9 w-9 shrink-0 ${overdue > 0 ? "text-red-600" : "text-emerald-600"}`}
          />
          <div>
            <p className={`text-2xl font-bold ${overdue > 0 ? "text-red-700" : "text-emerald-800"}`}>
              {overdue}現場
            </p>
            <p className={`text-lg font-semibold ${overdue > 0 ? "text-red-800" : "text-emerald-800"}`}>
              {overdue > 0 ? "工期超過" : "遅延なし"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
