import { WorkerForm } from "@/components/workers/worker-form";
import { PageHeader } from "@/components/shared/page-header";
import { createWorker } from "@/lib/actions/workers";

export default function NewWorkerPage() {
  return (
    <div>
      <PageHeader title="作業員登録" backHref="/workers" />
      <WorkerForm action={createWorker} submitLabel="登録する" />
    </div>
  );
}
