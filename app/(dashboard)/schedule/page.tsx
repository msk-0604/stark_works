import { ScheduleTodayList } from "@/components/schedule/schedule-today-list";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { PageHeader } from "@/components/shared/page-header";
import { getSchedules } from "@/lib/actions/schedules";
import { getSites } from "@/lib/actions/sites";
import { getWorkers } from "@/lib/actions/workers";
import { getTodayLabel } from "@/lib/utils/date";

interface SchedulePageProps {
  searchParams: Promise<{ add?: string }>;
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const { add } = await searchParams;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

  const [schedules, sites, workers] = await Promise.all([
    getSchedules(start, end),
    getSites(),
    getWorkers(),
  ]);

  return (
    <div className="space-y-4 pb-4">
      <PageHeader title="予定" subtitle={getTodayLabel()} />
      <ScheduleTodayList
        schedules={schedules}
        sites={sites}
        workers={workers}
        defaultShowForm={add === "1"}
      />
      <FloatingActionButton href="/schedule?add=1" label="予定を追加" />
    </div>
  );
}
