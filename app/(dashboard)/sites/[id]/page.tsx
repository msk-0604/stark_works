import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { PhotoTimeline } from "@/components/sites/photo-timeline";
import { SiteHeader } from "@/components/sites/site-header";
import { SiteQuickActions } from "@/components/sites/site-quick-actions";
import { TaskChecklist } from "@/components/sites/task-checklist";
import { getPhotos } from "@/lib/actions/photos";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSite } from "@/lib/actions/sites";
import { getTasks } from "@/lib/actions/tasks";
import { calcProgress } from "@/lib/utils/progress";

interface SiteDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SiteDetailPage({ params }: SiteDetailPageProps) {
  const { id } = await params;
  const [site, tasks, photos] = await Promise.all([getSite(id), getTasks(id), getPhotos(id)]);

  if (!site) notFound();

  const completed = tasks.filter((t) => t.is_completed).length;
  const progress = calcProgress(completed, tasks.length);
  return (
    <div className="space-y-5 pb-32 md:pb-5">
      <PageHeader
        title="現場詳細"
        backHref="/sites"
        action={
          <Button asChild variant="outline" size="lg" className="min-h-[56px] tap-scale">
            <Link href={`/sites/${id}/edit`}>
              <Pencil className="mr-2 h-5 w-5" />
              編集
            </Link>
          </Button>
        }
      />

      <SiteHeader site={site} progress={progress} />

      <SiteQuickActions site={site} />

      <Card className="border-2 border-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">作業チェックリスト</CardTitle>
          <p className="text-lg text-muted-foreground">
            {completed} / {tasks.length} 完了
          </p>
        </CardHeader>
        <CardContent>
          <TaskChecklist siteId={id} initialTasks={tasks} />
        </CardContent>
      </Card>

      <Card className="border-2" id="photos">
        <CardHeader>
          <CardTitle className="text-2xl">写真</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoTimeline siteId={id} initialPhotos={photos} />
        </CardContent>
      </Card>
    </div>
  );
}
