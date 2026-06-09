import { WorkerList } from "@/components/workers/worker-list";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { PageHeader } from "@/components/shared/page-header";
import { getWorkers } from "@/lib/actions/workers";

export default async function WorkersPage() {
  const workers = await getWorkers();

  return (
    <div className="pb-4">
      <PageHeader title="作業員" subtitle={`全 ${workers.length} 名`} />
      <WorkerList workers={workers} />
      <FloatingActionButton href="/workers/new" label="作業員を登録" />
    </div>
  );
}
