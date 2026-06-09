import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { PhotoGallery } from "@/components/sites/photo-gallery";
import { ProgressBar } from "@/components/sites/progress-bar";
import { SiteInfoActions } from "@/components/sites/site-info-actions";
import { TaskChecklist } from "@/components/sites/task-checklist";
import { getPhotos } from "@/lib/actions/photos";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
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
  const nextTask = tasks.find((t) => !t.is_completed);

  return (
    <div className="space-y-5">
      <PageHeader
        title={site.name}
        backHref="/sites"
        subtitle={site.customer_name ?? undefined}
        action={
          <Button asChild variant="outline" size="lg" className="tap-scale">
            <Link href={`/sites/${id}/edit`}>
              <Pencil className="mr-2 h-5 w-5" />
              現場を編集
            </Link>
          </Button>
        }
      />

      <Card className="border-2 border-primary/30 bg-accent/30">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">進捗</span>
            <StatusBadge status={site.status} />
          </div>
          <ProgressBar percent={progress} size="lg" />
          <p className="text-lg font-semibold">
            {completed} / {tasks.length} 作業完了
          </p>
          {nextTask && (
            <p className="text-base text-muted-foreground">
              次の作業: <span className="font-bold text-foreground">{nextTask.title}</span>
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>作業チェックリスト</CardTitle>
          <p className="text-lg text-muted-foreground">終わったら「完了」を押してください</p>
        </CardHeader>
        <CardContent>
          <TaskChecklist siteId={id} initialTasks={tasks} />
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>現場写真</CardTitle>
          <p className="text-lg text-muted-foreground">「写真を撮る」でカメラが開きます</p>
        </CardHeader>
        <CardContent>
          <PhotoGallery siteId={id} initialPhotos={photos} />
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>現場情報</CardTitle>
        </CardHeader>
        <CardContent>
          <SiteInfoActions site={site} />
        </CardContent>
      </Card>
    </div>
  );
}
