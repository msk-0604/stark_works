import { SiteListWithSearch } from "@/components/sites/site-list-with-search";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { PageHeader } from "@/components/shared/page-header";
import { getSites } from "@/lib/actions/sites";

export default async function SitesPage() {
  const sites = await getSites();

  return (
    <div className="space-y-4 pb-4">
      <PageHeader title="現場一覧" subtitle={`全 ${sites.length} 件`} />
      <p className="-mt-2 text-lg text-muted-foreground">現場名・顧客名・住所で検索できます</p>
      <SiteListWithSearch sites={sites} />
      <FloatingActionButton href="/sites/new" label="現場を登録" />
    </div>
  );
}
