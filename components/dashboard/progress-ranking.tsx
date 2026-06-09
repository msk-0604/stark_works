import Link from "next/link";
import { MapPin } from "lucide-react";

import { ProgressBar } from "@/components/sites/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteWithProgress } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";
import { mapsHref } from "@/lib/utils/contact";

interface ProgressRankingProps {
  sites: SiteWithProgress[];
}

const rankStyles = [
  "bg-emerald-100 border-emerald-400",
  "bg-amber-50 border-amber-400",
  "bg-red-50 border-red-400",
];

const rankLabels = ["1位", "2位", "3位"];

export function ProgressRanking({ sites }: ProgressRankingProps) {
  const top3 = sites.slice(0, 3);

  return (
    <Card className="border-2 border-slate-400 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl">現場進捗ランキング</CardTitle>
        <p className="text-lg text-muted-foreground">どこまで終わっているか</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {top3.length === 0 ? (
          <p className="py-4 text-center text-lg text-muted-foreground">進行中の現場がありません</p>
        ) : (
          top3.map((site, i) => (
            <div
              key={site.id}
              className={cn(
                "space-y-3 rounded-xl border-2 p-5",
                rankStyles[i] ?? "bg-card border-border"
              )}
            >
              <Link href={`/sites/${site.id}`} className="tap-scale block space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {rankLabels[i]}
                  </span>
                  <p className="text-xl font-bold leading-snug">{site.name}</p>
                </div>
                <ProgressBar percent={site.progress_percent} size="lg" />
                <p className="text-lg font-semibold text-muted-foreground">
                  {site.completed_count} / {site.task_count} 作業完了
                </p>
              </Link>
              {site.address && (
                <a
                  href={mapsHref(site.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-scale flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-emerald-700 text-lg font-bold text-white"
                >
                  <MapPin className="h-6 w-6" />
                  Googleマップ
                </a>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
