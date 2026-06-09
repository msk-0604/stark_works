interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <p className="rounded-xl border-2 border-dashed border-border bg-card p-8 text-center text-lg text-muted-foreground">
      {message}
    </p>
  );
}
