import Link from "next/link";
import { Search } from "lucide-react";

import { DelayAlerts } from "@/components/dashboard/delay-alerts";
import { MainMenuCards } from "@/components/dashboard/main-menu-cards";
import { MorningBriefingCard } from "@/components/dashboard/morning-briefing";
import { ProgressRanking } from "@/components/dashboard/progress-ranking";
import { TodayPersonnelBoard } from "@/components/dashboard/today-personnel";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { AddButton } from "@/components/shared/add-button";
import { Button } from "@/components/ui/button";
import {
  getDelayedSites,
  getMorningBriefing,
  getProgressRanking,
  getTodayPersonnel,
  getTodaySchedules,
} from "@/lib/actions/dashboard";

export default async function DashboardPage() {
  const [briefing, todaySchedules, personnel, delayed, ranking] = await Promise.all([
    getMorningBriefing(),
    getTodaySchedules(),
    getTodayPersonnel(),
    getDelayedSites(),
    getProgressRanking(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">ホーム</h1>
        <p className="mt-1 text-xl text-muted-foreground">朝の5秒チェック</p>
      </div>

      <MorningBriefingCard briefing={briefing} />

      <MainMenuCards />

      <TodaySchedule schedules={todaySchedules} />

      <TodayPersonnelBoard personnel={personnel} />

      <DelayAlerts sites={delayed} />

      <ProgressRanking sites={ranking} />

      <div className="space-y-3 rounded-xl border-2 border-slate-300 bg-slate-50 p-4">
        <p className="text-xl font-bold">データを追加する</p>
        <AddButton href="/sites/new" label="現場を登録する" />
        <AddButton href="/schedule?add=1" label="予定を追加する" />
      </div>

      <Button asChild size="lg" className="w-full min-h-[72px] text-xl tap-scale">
        <Link href="/sites">
          <Search className="mr-2 h-6 w-6" />
          現場を検索する
        </Link>
      </Button>
    </div>
  );
}
