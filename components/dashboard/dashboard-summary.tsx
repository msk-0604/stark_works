interface DashboardSummaryProps {
  scheduleCount: number;
  topSiteName?: string;
  topProgress?: number;
  laggingSiteName?: string;
  laggingProgress?: number;
}

export function DashboardSummary({
  scheduleCount,
  topSiteName,
  topProgress,
  laggingSiteName,
  laggingProgress,
}: DashboardSummaryProps) {
  return (
    <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
      <p className="text-xl font-bold leading-relaxed text-foreground">
        今日は <span className="text-primary">{scheduleCount}件</span> の予定があります
      </p>
      {topSiteName && topProgress !== undefined && (
        <p className="mt-2 text-lg text-foreground">
          もっとも進んでいる現場は
          <span className="font-bold"> {topSiteName}（{topProgress}%）</span>
        </p>
      )}
      {laggingSiteName && laggingProgress !== undefined && (
        <p className="mt-1 text-lg text-foreground">
          要注意は
          <span className="font-bold text-amber-700"> {laggingSiteName}（{laggingProgress}%）</span>
        </p>
      )}
    </div>
  );
}
