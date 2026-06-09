import Link from "next/link";
import { Trophy } from "lucide-react";

import { ProgressBar } from "@/components/sites/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteWithProgress } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

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
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Trophy className="h-7 w-7 text-primary" />
          現場進捗ランキング
        </CardTitle>
        <p className="text-lg text-muted-foreground">どの現場が進んでいるか一目で分かります</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {top3.length === 0 ? (
          <p className="py-4 text-center text-lg text-muted-foreground">進行中の現場がありません</p>
        ) : (
          top3.map((site, i) => (
            <Link
              key={site.id}
              href={`/sites/${site.id}`}
              className={cn(
                "tap-scale block space-y-3 rounded-xl border-2 p-5 active:scale-[0.98]",
                rankStyles[i] ?? "bg-card border-border"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {rankLabels[i]}
                  </span>
                  <p className="text-xl font-bold leading-snug">{site.name}</p>
                </div>
              </div>
              <ProgressBar percent={site.progress_percent} size="lg" />
              <p className="text-base font-semibold text-muted-foreground">
                {site.completed_count} / {site.task_count} 作業完了
              </p>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
