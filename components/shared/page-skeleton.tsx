export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-5" aria-label="読み込み中">
      <div className="space-y-2">
        <div className="h-9 w-40 rounded-lg bg-muted" />
        <div className="h-6 w-56 rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="h-28 rounded-xl bg-muted" />
        <div className="h-28 rounded-xl bg-muted" />
        <div className="h-28 rounded-xl bg-muted" />
      </div>
      <div className="h-40 rounded-xl bg-muted" />
      <div className="h-40 rounded-xl bg-muted" />
    </div>
  );
}
