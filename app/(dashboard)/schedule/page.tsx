import { ScheduleCalendar } from "@/components/schedule/schedule-calendar";
import { PageHeader } from "@/components/shared/page-header";
import { HelpBanner } from "@/components/shared/help-banner";
import { getSchedules } from "@/lib/actions/schedules";
import { getSites } from "@/lib/actions/sites";
import { getWorkers } from "@/lib/actions/workers";
export default async function SchedulePage() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

  const [schedules, sites, workers] = await Promise.all([
    getSchedules(start, end),
    getSites(),
    getWorkers(),
  ]);

  return (
    <div>
      <PageHeader title="スケジュール" />
      <HelpBanner text="日・週・月を切り替えて予定を確認できます。「予定を追加」から登録してください。" />
      <ScheduleCalendar schedules={schedules} sites={sites} workers={workers} />
    </div>
  );
}
