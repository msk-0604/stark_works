import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  percent: number;
  showLabel?: boolean;
  size?: "sm" | "lg";
}

function getBarColor(percent: number): string {
  if (percent >= 70) return "bg-emerald-600";
  if (percent >= 40) return "bg-amber-500";
  return "bg-red-500";
}

function getTextColor(percent: number): string {
  if (percent >= 70) return "text-emerald-700";
  if (percent >= 40) return "text-amber-700";
  return "text-red-600";
}

export function ProgressBar({ percent, showLabel = true, size = "sm" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-full bg-slate-200",
          size === "lg" ? "h-5" : "h-4"
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all", getBarColor(clamped))}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn("font-bold", getTextColor(clamped), size === "lg" ? "text-2xl" : "text-lg")}>
          {clamped}%
        </span>
      )}
    </div>
  );
}
