import Link from "next/link";
import { AlertTriangle, Calendar, ChevronRight, MapPin, User, Users } from "lucide-react";

import { ProgressBar } from "@/components/sites/progress-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import type { SiteListItem } from "@/lib/types/database";
import { formatExpectedEndDate } from "@/lib/utils/site";
import { cn } from "@/lib/utils/cn";

interface SiteCardProps {
  site: SiteListItem;
}

export function SiteCard({ site }: SiteCardProps) {
  const endDate = formatExpectedEndDate(site.expected_end_date);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border-2 bg-white shadow-sm",
        site.is_overdue ? "border-red-500" : site.is_active_today ? "border-primary" : "border-slate-400"
      )}
    >
      {site.is_overdue && (
        <div className="flex items-center justify-center gap-2 bg-red-600 px-4 py-3 text-xl font-bold text-white">
          <AlertTriangle className="h-6 w-6" />
          工期超過
        </div>
      )}

      <Link href={`/sites/${site.id}`} className="tap-scale block p-5 active:bg-slate-50">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-bold leading-snug">{site.name}</h2>
          <StatusBadge status={site.status} />
        </div>

        {site.customer_name && (
          <p className="mt-2 text-lg text-muted-foreground">{site.customer_name}</p>
        )}

        {site.address && (
          <p className="mt-2 flex items-start gap-2 text-lg text-muted-foreground">
            <MapPin className="mt-1 h-5 w-5 shrink-0" />
            <span>{site.address}</span>
          </p>
        )}

        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
            <dt className="flex items-center gap-2 text-base font-bold text-primary">
              <User className="h-5 w-5" />
              担当者
            </dt>
            <dd className="mt-1 text-xl font-bold">
              {site.assignee_name ?? "未設定"}
            </dd>
          </div>

          <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
            <dt className="flex items-center gap-2 text-base font-bold text-primary">
              <Calendar className="h-5 w-5" />
              完了予定
            </dt>
            <dd className={cn("mt-1 text-xl font-bold", site.is_overdue && "text-red-700")}>
              {endDate ?? "未設定"}
            </dd>
          </div>

          <div
            className={cn(
              "rounded-xl border-2 p-4 sm:col-span-2",
              site.today_worker_count > 0
                ? "border-primary bg-primary/5"
                : "border-slate-200 bg-slate-50"
            )}
          >
            <dt className="flex items-center gap-2 text-base font-bold text-primary">
              <Users className="h-5 w-5" />
              本日配置
            </dt>
            <dd className="mt-1 text-xl font-bold">
              {site.today_worker_count > 0 ? `${site.today_worker_count}名` : "予定なし"}
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <ProgressBar percent={site.progress_percent} size="lg" />
          <p className="mt-2 text-lg font-semibold text-muted-foreground">
            作業 {site.completed_count} / {site.task_count} 完了
          </p>
        </div>
      </Link>

      <div className="border-t-2 border-slate-200 p-4">
        <Link
          href={`/sites/${site.id}`}
          className="tap-scale flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-primary text-xl font-bold text-primary-foreground"
        >
          詳細を見る
          <ChevronRight className="h-7 w-7" />
        </Link>
      </div>
    </article>
  );
}
