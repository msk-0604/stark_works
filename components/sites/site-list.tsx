import { SiteCard } from "@/components/sites/site-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { SiteWithProgress } from "@/lib/types/database";

interface SiteListProps {
  sites: SiteWithProgress[];
}

export function SiteList({ sites }: SiteListProps) {
  if (sites.length === 0) {
    return <EmptyState message="現場が登録されていません。新規登録してください。" />;
  }

  return (
    <div className="grid gap-4">
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
}
