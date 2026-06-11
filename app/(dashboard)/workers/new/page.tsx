import { WorkerForm } from "@/components/workers/worker-form";
import { PageHeader } from "@/components/shared/page-header";
import { LABELS } from "@/lib/constants/labels";
import { createWorker } from "@/lib/actions/workers";

export default function NewWorkerPage() {
  return (
    <div>
      <PageHeader title={LABELS.memberAdd} backHref="/workers" />
      <WorkerForm action={createWorker} submitLabel="登録する" />
    </div>
  );
}
