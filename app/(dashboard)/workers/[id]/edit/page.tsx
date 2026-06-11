import { notFound } from "next/navigation";

import { WorkerForm } from "@/components/workers/worker-form";
import { PageHeader } from "@/components/shared/page-header";
import { DeleteWorkerButton } from "@/components/workers/delete-worker-button";
import { LABELS } from "@/lib/constants/labels";
import { getWorker, updateWorker } from "@/lib/actions/workers";

interface EditWorkerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkerPage({ params }: EditWorkerPageProps) {
  const { id } = await params;
  const worker = await getWorker(id);

  if (!worker) notFound();

  const boundUpdate = updateWorker.bind(null, id);

  return (
    <div>
      <PageHeader title={LABELS.memberEdit} backHref="/workers" />
      <WorkerForm action={boundUpdate} worker={worker} submitLabel="更新する" />
      <div className="mt-8">
        <DeleteWorkerButton workerId={id} workerName={worker.full_name} />
      </div>
    </div>
  );
}
