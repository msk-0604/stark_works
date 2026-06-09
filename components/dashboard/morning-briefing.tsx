import { AlertTriangle, CheckCircle2 } from "lucide-react";

import type { MorningBriefing } from "@/lib/types/database";
import { getTodayLabel } from "@/lib/utils/date";

interface MorningBriefingProps {
  briefing: MorningBriefing;
}

function formatNames(names: string[], max = 3): string {
  if (names.length === 0) return "予定なし";
  if (names.length <= max) return names.join("・");
  return `${names.slice(0, max).join("・")} 他${names.length - max}名`;
}

function formatSites(names: string[], max = 2): string {
  if (names.length === 0) return "予定なし";
  if (names.length <= max) return names.join("・");
  return `${names[0]} 他${names.length - 1}現場`;
}

export function MorningBriefingCard({ briefing }: MorningBriefingProps) {
  return (
    <section className="rounded-2xl border-2 border-primary bg-white p-5 shadow-md">
      <p className="text-lg font-semibold text-muted-foreground">{getTodayLabel()}</p>
      <h2 className="mt-1 text-2xl font-bold">朝の5秒チェック</h2>

      <dl className="mt-5 space-y-4">
        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-4">
          <dt className="text-base font-bold text-primary">誰が</dt>
          <dd className="mt-1 text-2xl font-bold leading-snug">
            {formatNames(briefing.workerNames)}
            {briefing.workerCount > 0 && (
              <span className="ml-2 text-xl text-muted-foreground">（{briefing.workerCount}名）</span>
            )}
          </dd>
        </div>

        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-4">
          <dt className="text-base font-bold text-primary">どこで</dt>
          <dd className="mt-1 text-2xl font-bold leading-snug">
            {formatSites(briefing.siteNames)}
            {briefing.siteCount > 0 && (
              <span className="ml-2 text-xl text-muted-foreground">（{briefing.siteCount}現場）</span>
            )}
          </dd>
        </div>

        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-4">
          <dt className="text-base font-bold text-primary">何を</dt>
          <dd className="mt-1 text-xl font-bold leading-snug">
            {briefing.nextUp ? (
              <>
                <span className="text-primary">{briefing.nextUp.time_label}</span>
                {" · "}
                {briefing.nextUp.worker_name} → {briefing.nextUp.site_name}
                <p className="mt-2 rounded-lg bg-white px-3 py-2 text-xl">{briefing.nextUp.title}</p>
              </>
            ) : (
              "本日の予定はありません"
            )}
          </dd>
        </div>

        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-4">
          <dt className="text-base font-bold text-primary">どこまで</dt>
          <dd className="mt-2 space-y-2 text-xl font-bold">
            {briefing.topSite && (
              <p>
                <span className="text-emerald-700">先行</span>
                {" "}{briefing.topSite.name} {briefing.topSite.progress}%
              </p>
            )}
            {briefing.worstSite && (
              <p>
                <span className="text-red-700">遅れ</span>
                {" "}{briefing.worstSite.name} {briefing.worstSite.progress}%
              </p>
            )}
            {!briefing.topSite && !briefing.worstSite && (
              <p className="text-muted-foreground">進行中の現場がありません</p>
            )}
          </dd>
        </div>
      </dl>

      {briefing.delayedCount > 0 ? (
        <div className="mt-4 flex items-center gap-3 rounded-xl border-2 border-red-400 bg-red-50 p-4">
          <AlertTriangle className="h-8 w-8 shrink-0 text-red-600" />
          <p className="text-xl font-bold text-red-800">
            遅延現場 {briefing.delayedCount}件 — 下の詳細を確認
          </p>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-3 rounded-xl border-2 border-emerald-400 bg-emerald-50 p-4">
          <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-600" />
          <p className="text-xl font-bold text-emerald-800">遅延現場はありません</p>
        </div>
      )}
    </section>
  );
}
