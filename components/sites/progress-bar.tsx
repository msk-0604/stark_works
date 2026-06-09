import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  percent: number;
  showLabel?: boolean;
  size?: "sm" | "lg";
}

export function ProgressBar({ percent, showLabel = true, size = "sm" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-full bg-muted",
          size === "lg" ? "h-4" : "h-3"
        )}
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn("font-bold text-primary", size === "lg" ? "text-xl" : "text-base")}>
          {clamped}%
        </span>
      )}
    </div>
  );
}
