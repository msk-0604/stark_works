import Link from "next/link";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { HelpBanner } from "@/components/shared/help-banner";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/actions/dashboard";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ホーム</h1>
        <p className="mt-1 text-xl text-muted-foreground">今日の現場の状況</p>
      </div>

      <DashboardStats {...stats} />

      <div>
        <h2 className="mb-3 text-xl font-bold">よく使う機能</h2>
        <QuickActions />
      </div>

      <HelpBanner text="現場をタップ → 作業の「完了」ボタンを押す → 写真を撮る、の順で使います。" />

      <Button asChild size="lg" className="w-full tap-scale">
        <Link href="/sites">現場一覧を見る</Link>
      </Button>
    </div>
  );
}
