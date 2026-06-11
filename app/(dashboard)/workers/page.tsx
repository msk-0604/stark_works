import { WorkerList } from "@/components/workers/worker-list";
import { AddButton } from "@/components/shared/add-button";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { PageHeader } from "@/components/shared/page-header";
import { LABELS } from "@/lib/constants/labels";
import { getWorkersOverview } from "@/lib/actions/workers";
import { getTodayLabel } from "@/lib/utils/date";

export default async function WorkersPage() {
  const workers = await getWorkersOverview();

  return (
    <div className="space-y-5 pb-4">
      <PageHeader
        title={LABELS.member}
        subtitle={`${getTodayLabel()} · 全 ${workers.length} 名`}
      />

      <AddButton href="/workers/new" label={`${LABELS.memberAdd}する`} />

      <WorkerList workers={workers} />
      <FloatingActionButton href="/workers/new" label={LABELS.memberAdd} />
    </div>
  );
}
