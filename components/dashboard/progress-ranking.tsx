import Link from "next/link";
import { TrendingUp } from "lucide-react";

import { ProgressBar } from "@/components/sites/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteWithProgress } from "@/lib/types/database";

interface ProgressRankingProps {
  sites: SiteWithProgress[];
}

export function ProgressRanking({ sites }: ProgressRankingProps) {
  return (
    <Card className="border-2 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <TrendingUp className="h-7 w-7 text-primary" />
          現場進捗
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sites.length === 0 ? (
          <p className="py-4 text-center text-lg text-muted-foreground">進行中の現場がありません</p>
        ) : (
          sites.map((site, i) => (
            <Link
              key={site.id}
              href={`/sites/${site.id}`}
              className="tap-scale block space-y-2 rounded-xl border-2 border-border p-4 active:border-primary"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <p className="text-xl font-bold">{site.name}</p>
                </div>
                <p className="text-2xl font-bold text-primary">{site.progress_percent}%</p>
              </div>
              <ProgressBar percent={site.progress_percent} showLabel={false} size="lg" />
              <p className="text-base text-muted-foreground">
                {site.completed_count} / {site.task_count} 作業完了
              </p>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
