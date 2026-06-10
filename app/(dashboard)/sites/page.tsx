import { SiteListWithSearch } from "@/components/sites/site-list-with-search";
import { SitesOverview } from "@/components/sites/sites-overview";
import { AddButton } from "@/components/shared/add-button";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { PageHeader } from "@/components/shared/page-header";
import { getSitesForList } from "@/lib/actions/sites";
import { sortSitesForList } from "@/lib/utils/site";

export default async function SitesPage() {
  const sites = sortSitesForList(await getSitesForList());

  return (
    <div className="space-y-5 pb-4">
      <PageHeader title="現場一覧" subtitle={`全 ${sites.length} 件`} />

      {sites.length > 0 && <SitesOverview sites={sites} />}

      <AddButton href="/sites/new" label="現場を登録する" />

      <SiteListWithSearch sites={sites} />
      <FloatingActionButton href="/sites/new" label="現場を登録" />
    </div>
  );
}
