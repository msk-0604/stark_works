import { EmptyState } from "@/components/shared/empty-state";
import { WorkerCard } from "@/components/workers/worker-card";
import type { WorkerWithOverview } from "@/lib/types/database";

interface WorkerListProps {
  workers: WorkerWithOverview[];
}

export function WorkerList({ workers }: WorkerListProps) {
  if (workers.length === 0) {
    return <EmptyState message="作業員が登録されていません。新規登録してください。" />;
  }

  return (
    <div className="grid gap-5">
      {workers.map((worker) => (
        <WorkerCard key={worker.id} worker={worker} />
      ))}
    </div>
  );
}
