import { SITE_STATUS_LABELS, type SiteStatus } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

const statusColors: Record<SiteStatus, string> = {
  not_started: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  on_hold: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
};

interface StatusBadgeProps {
  status: SiteStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-lg px-3 py-1 text-sm font-semibold",
        statusColors[status],
        className
      )}
    >
      {SITE_STATUS_LABELS[status]}
    </span>
  );
}
