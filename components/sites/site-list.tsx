import { EmptyState } from "@/components/shared/empty-state";
import { SiteCard } from "@/components/sites/site-card";
import type { SiteWithProgress } from "@/lib/types/database";

interface SiteListProps {
  sites: SiteWithProgress[];
  emptyMessage?: string;
  emptyActionHref?: string;
  emptyActionLabel?: string;
}

export function SiteList({ sites, emptyMessage, emptyActionHref, emptyActionLabel }: SiteListProps) {
  if (sites.length === 0) {
    return (
      <EmptyState
        message={emptyMessage ?? "現場が登録されていません。下のボタンから登録してください。"}
        actionHref={emptyActionHref}
        actionLabel={emptyActionLabel}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
}
