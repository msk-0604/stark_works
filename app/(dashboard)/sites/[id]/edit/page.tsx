import { notFound } from "next/navigation";

import { SiteForm } from "@/components/sites/site-form";
import { PageHeader } from "@/components/shared/page-header";
import { DeleteSiteButton } from "@/components/sites/delete-site-button";
import { getSite } from "@/lib/actions/sites";
import { getWorkers } from "@/lib/actions/workers";
import { updateSite } from "@/lib/actions/sites";

interface EditSitePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSitePage({ params }: EditSitePageProps) {
  const { id } = await params;
  const [site, workers] = await Promise.all([getSite(id), getWorkers()]);

  if (!site) notFound();

  const boundUpdate = updateSite.bind(null, id);

  return (
    <div>
      <PageHeader title="現場編集" backHref={`/sites/${id}`} />
      <SiteForm action={boundUpdate} site={site} workers={workers} submitLabel="更新する" />
      <div className="mt-8">
        <DeleteSiteButton siteId={id} siteName={site.name} />
      </div>
    </div>
  );
}
