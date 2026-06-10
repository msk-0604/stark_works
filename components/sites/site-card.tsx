import Link from "next/link";
import { AlertTriangle, ChevronRight, MapPin } from "lucide-react";

import { ProgressBar } from "@/components/sites/progress-bar";
import type { SiteListItem } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

interface SiteCardProps {
  site: SiteListItem;
}

export function SiteCard({ site }: SiteCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border-2 bg-white shadow-sm",
        site.is_overdue ? "border-red-500" : "border-slate-400"
      )}
    >
      {site.is_overdue && (
        <div className="flex items-center justify-center gap-2 bg-red-600 px-4 py-2 text-lg font-bold text-white">
          <AlertTriangle className="h-5 w-5" />
          工期超過
        </div>
      )}

      <Link href={`/sites/${site.id}`} className="tap-scale block p-5 active:bg-slate-50">
        <h2 className="text-2xl font-bold leading-snug">{site.name}</h2>

        {site.address && (
          <p className="mt-2 flex items-start gap-2 text-lg text-muted-foreground">
            <MapPin className="mt-1 h-5 w-5 shrink-0" />
            <span>{site.address}</span>
          </p>
        )}

        <div className="mt-4">
          <ProgressBar percent={site.progress_percent} size="lg" />
          <p className="mt-2 text-lg font-semibold">
            進捗 {site.progress_percent}% · 作業 {site.completed_count}/{site.task_count}
          </p>
        </div>
      </Link>

      <div className="border-t-2 border-slate-200 p-4">
        <Link
          href={`/sites/${site.id}`}
          className="tap-scale flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-primary text-xl font-bold text-primary-foreground"
        >
          開く
          <ChevronRight className="h-7 w-7" />
        </Link>
      </div>
    </article>
  );
}
