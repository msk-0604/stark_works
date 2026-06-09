import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";

import { ProgressBar } from "@/components/sites/progress-bar";
import { QuickContactButtons } from "@/components/shared/quick-contact-buttons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DelayedSite } from "@/lib/types/database";

interface DelayAlertsProps {
  sites: DelayedSite[];
}

export function DelayAlerts({ sites }: DelayAlertsProps) {
  if (sites.length === 0) return null;

  return (
    <Card className="border-2 border-red-500 bg-red-50 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-2xl text-red-800">
          <AlertTriangle className="h-7 w-7" />
          遅延現場アラート
        </CardTitle>
        <p className="text-lg font-semibold text-red-700">{sites.length}件の現場が要注意です</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {sites.map((site) => (
          <div
            key={site.id}
            className="rounded-xl border-2 border-red-400 bg-white p-4"
          >
            <Link href={`/sites/${site.id}`} className="tap-scale block">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xl font-bold leading-snug">{site.name}</p>
                  <p className="mt-2 rounded-lg bg-red-100 px-3 py-2 text-lg font-bold text-red-800">
                    {site.delay_reason}
                  </p>
                </div>
                <ChevronRight className="h-7 w-7 shrink-0 text-red-600" />
              </div>
              <div className="mt-3">
                <ProgressBar percent={site.progress_percent} size="lg" />
              </div>
            </Link>
            <QuickContactButtons
              phone={site.phone}
              address={site.address}
              phoneLabel="現場に電話"
              className="mt-3"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
