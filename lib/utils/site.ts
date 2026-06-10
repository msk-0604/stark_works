import type { SiteStatus } from "@/lib/types/database";

export function isSiteOverdue(
  expectedEndDate: string | null,
  status: SiteStatus
): boolean {
  if (!expectedEndDate || status === "completed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(expectedEndDate);
  end.setHours(0, 0, 0, 0);
  return today > end;
}

export function formatExpectedEndDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export function sortSitesForList<T extends { is_overdue: boolean; today_worker_count: number; name: string }>(
  sites: T[]
): T[] {
  return [...sites].sort((a, b) => {
    if (a.is_overdue !== b.is_overdue) return a.is_overdue ? -1 : 1;
    if (a.today_worker_count !== b.today_worker_count) {
      return b.today_worker_count - a.today_worker_count;
    }
    return a.name.localeCompare(b.name);
  });
}
