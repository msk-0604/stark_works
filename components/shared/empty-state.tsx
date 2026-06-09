import Link from "next/link";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  message: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({ message, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="space-y-4 rounded-xl border-2 border-dashed border-primary/50 bg-card p-8 text-center">
      <p className="text-xl text-muted-foreground">{message}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="tap-scale mx-auto flex min-h-[72px] max-w-md items-center justify-center gap-3 rounded-xl bg-primary px-6 text-xl font-bold text-primary-foreground"
        >
          <Plus className="h-8 w-8" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
