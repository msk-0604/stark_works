import { ScheduleCalendar } from "@/components/schedule/schedule-calendar";
import { AddButton } from "@/components/shared/add-button";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { PageHeader } from "@/components/shared/page-header";
import { getSchedules } from "@/lib/actions/schedules";
import { getSites } from "@/lib/actions/sites";
import { getWorkers } from "@/lib/actions/workers";

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
      <PageHeader title="スケジュール" subtitle="作業員の予定を登録・確認" />
      <AddButton href="/schedule?add=1" label="予定を追加する" />
      <ScheduleCalendar
        schedules={schedules}
        sites={sites}
        workers={workers}
        defaultShowForm={add === "1"}
      />
      <FloatingActionButton href="/schedule?add=1" label="予定を追加" />
    </div>
  );
}
