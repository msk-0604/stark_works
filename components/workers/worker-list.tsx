import Link from "next/link";
import { Pencil, Phone } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Worker } from "@/lib/types/database";

interface WorkerListProps {
  workers: Worker[];
}

export function WorkerList({ workers }: WorkerListProps) {
  if (workers.length === 0) {
    return <EmptyState message="作業員が登録されていません。新規登録してください。" />;
  }

  return (
    <div className="grid gap-4">
      {workers.map((worker) => (
        <Card key={worker.id} className="border-2">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="text-xl">{worker.full_name}</CardTitle>
              {worker.position && (
                <p className="mt-1 text-base text-muted-foreground">{worker.position}</p>
              )}
            </div>
            <Button variant="outline" size="lg" className="tap-scale" asChild>
              <Link href={`/workers/${worker.id}/edit`}>
                <Pencil className="mr-1 h-5 w-5" />
                編集
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1 text-base text-muted-foreground">
            {worker.phone && (
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {worker.phone}
              </p>
            )}
            {worker.email && <p>{worker.email}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
