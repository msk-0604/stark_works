import { SiteList } from "@/components/sites/site-list";
import { HelpBanner } from "@/components/shared/help-banner";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { PageHeader } from "@/components/shared/page-header";
import { getSites } from "@/lib/actions/sites";

export default async function SitesPage() {
  const sites = await getSites();

  return (
    <div className="pb-4">
      <PageHeader title="現場一覧" subtitle={`全 ${sites.length} 件`} />
      <HelpBanner text="現場をタップすると、作業の完了や写真の撮影ができます。" />
      <SiteList sites={sites} />
      <FloatingActionButton href="/sites/new" label="現場を登録" />
    </div>
  );
}
