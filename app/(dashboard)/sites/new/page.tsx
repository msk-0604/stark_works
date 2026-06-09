import { SiteForm } from "@/components/sites/site-form";
import { PageHeader } from "@/components/shared/page-header";
import { createSite } from "@/lib/actions/sites";
import { getWorkers } from "@/lib/actions/workers";

export default async function NewSitePage() {
  const workers = await getWorkers();

  return (
    <div>
      <PageHeader title="現場登録" backHref="/sites" />
      <SiteForm action={createSite} workers={workers} submitLabel="登録する" />
    </div>
  );
}
