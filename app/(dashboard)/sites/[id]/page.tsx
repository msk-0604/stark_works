import { notFound } from "next/navigation";

import { SiteDetailView } from "@/components/sites/site-detail-view";
import { getPhotos } from "@/lib/actions/photos";
import { getSite } from "@/lib/actions/sites";
import { getTasks } from "@/lib/actions/tasks";

interface SiteDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SiteDetailPage({ params }: SiteDetailPageProps) {
  const { id } = await params;
  const [site, tasks, photos] = await Promise.all([getSite(id), getTasks(id), getPhotos(id)]);

  if (!site) notFound();

  return <SiteDetailView site={site} initialTasks={tasks} initialPhotos={photos} />;
}
