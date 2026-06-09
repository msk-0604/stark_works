import { WorkerList } from "@/components/workers/worker-list";
import { WorkersSummary } from "@/components/workers/workers-summary";
import { AddButton } from "@/components/shared/add-button";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { PageHeader } from "@/components/shared/page-header";
import { getWorkersOverview } from "@/lib/actions/workers";
import { getTodayLabel } from "@/lib/utils/date";

export default async function WorkersPage() {
  const workers = await getWorkersOverview();

  return (
    <div className="space-y-5 pb-4">
      <PageHeader
        title="作業員"
        subtitle={`全 ${workers.length} 名 · ${getTodayLabel()}`}
      />
      <p className="-mt-3 text-lg text-muted-foreground">
        誰がどこで何をしているか、すぐに把握できます
      </p>

      <AddButton href="/workers/new" label="作業員を登録する" />

      {workers.length > 0 && <WorkersSummary workers={workers} />}

      <WorkerList workers={workers} />
      <FloatingActionButton href="/workers/new" label="作業員を登録" />
    </div>
  );
}
