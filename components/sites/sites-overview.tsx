import { CheckCircle2, PlayCircle } from "lucide-react";

import type { SiteListItem } from "@/lib/types/database";

interface SitesOverviewProps {
  sites: SiteListItem[];
}

export function SitesOverview({ sites }: SitesOverviewProps) {
  const inProgress = sites.filter((s) => s.status === "in_progress").length;
  const completed = sites.filter((s) => s.status === "completed").length;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex items-center gap-3 rounded-xl border-2 border-slate-300 bg-white p-4">
        <PlayCircle className="h-9 w-9 shrink-0 text-primary" />
        <div>
          <p className="text-3xl font-bold">{inProgress}</p>
          <p className="text-lg font-semibold">進行中</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border-2 border-slate-300 bg-white p-4">
        <CheckCircle2 className="h-9 w-9 shrink-0 text-emerald-600" />
        <div>
          <p className="text-3xl font-bold">{completed}</p>
          <p className="text-lg font-semibold">完了</p>
        </div>
      </div>
    </div>
  );
}
