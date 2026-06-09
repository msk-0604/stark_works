import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";

import { ProgressBar } from "@/components/sites/progress-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteWithProgress } from "@/lib/types/database";

interface SiteCardProps {
  site: SiteWithProgress;
}

export function SiteCard({ site }: SiteCardProps) {
  return (
    <Link href={`/sites/${site.id}`} className="tap-scale block">
      <Card className="border-2 shadow-sm active:border-primary">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-xl leading-snug">{site.name}</CardTitle>
            <StatusBadge status={site.status} />
          </div>
          {site.customer_name && (
            <p className="text-lg text-muted-foreground">{site.customer_name}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {site.address && (
            <p className="flex items-start gap-2 text-base text-muted-foreground">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{site.address}</span>
            </p>
          )}
          <ProgressBar percent={site.progress_percent} size="lg" />
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-muted-foreground">
              作業 {site.completed_count} / {site.task_count} 完了
            </p>
            <ChevronRight className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
