"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DelayedSite, MorningBriefing, Schedule, Site, SiteWithProgress, TodayPersonnel, Worker } from "@/lib/types/database";
import { getSites } from "@/lib/actions/sites";
import { formatTimeRange } from "@/lib/utils/date";

export interface DashboardStats {
  todaySites: number;
  inProgressSites: number;
  completedSites: number;
  workerCount: number;
}

const emptyStats: DashboardStats = {
  todaySites: 0,
  inProgressSites: 0,
  completedSites: 0,
  workerCount: 0,
};

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured()) return emptyStats;

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [schedulesResult, inProgressResult, completedResult, workersResult] =
    await Promise.all([
      supabase.from("schedules").select("site_id").gte("start_time", `${today}T00:00:00`).lte("start_time", `${today}T23:59:59`),
      supabase.from("sites").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
      supabase.from("sites").select("id", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("workers").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);

  const uniqueSiteIds = new Set((schedulesResult.data ?? []).map((s) => s.site_id));

  return {
    todaySites: uniqueSiteIds.size,
    inProgressSites: inProgressResult.count ?? 0,
    completedSites: completedResult.count ?? 0,
    workerCount: workersResult.count ?? 0,
  };
}

export async function getTodaySchedules(): Promise<Schedule[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("schedules")
    .select("*, site:sites(*), worker:workers(*)")
    .gte("start_time", `${today}T00:00:00`)
    .lte("start_time", `${today}T23:59:59`)
    .order("start_time");

  if (error || !data) return [];
  return data;
}

function unwrapRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function getDelayReason(site: SiteWithProgress): string | null {
  if (site.status === "completed") return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (site.expected_end_date) {
    const end = new Date(site.expected_end_date);
    end.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return `工期を${Math.abs(daysLeft)}日超過（${site.progress_percent}%）`;
    }
    if (daysLeft <= 7 && site.progress_percent < 70) {
      return `残り${daysLeft}日・進捗${site.progress_percent}%`;
    }
  }

  if (site.progress_percent < 40 && site.status === "in_progress") {
    return `進捗${site.progress_percent}%・要フォロー`;
  }

  return null;
}

export async function getDelayedSites(): Promise<DelayedSite[]> {
  const sites = await getSites();
  return sites
    .map((site) => {
      const reason = getDelayReason(site);
      if (!reason) return null;
      return { ...site, delay_reason: reason };
    })
    .filter((s): s is DelayedSite => s !== null)
    .sort((a, b) => a.progress_percent - b.progress_percent);
}

export async function getTodayPersonnel(): Promise<TodayPersonnel[]> {
  const schedules = await getTodaySchedules();
  const groups = new Map<string, TodayPersonnel>();

  for (const s of schedules) {
    const worker = unwrapRelation(s.worker as Worker | Worker[] | null);
    const site = unwrapRelation(s.site as Site | Site[] | null);

    const workerId = s.worker_id;
    const existing = groups.get(workerId) ?? {
      worker_id: workerId,
      worker_name: worker?.full_name ?? "作業員",
      worker_phone: worker?.phone ?? null,
      assignments: [],
    };

    existing.assignments.push({
      schedule_id: s.id,
      site_id: s.site_id,
      site_name: site?.name ?? "現場",
      site_address: site?.address ?? null,
      site_phone: site?.phone ?? null,
      title: s.title,
      start_time: s.start_time,
      end_time: s.end_time,
    });

    groups.set(workerId, existing);
  }

  return [...groups.values()].sort((a, b) => a.worker_name.localeCompare(b.worker_name));
}

export async function getMorningBriefing(): Promise<MorningBriefing> {
  const [schedules, ranking, delayed] = await Promise.all([
    getTodaySchedules(),
    getProgressRanking(),
    getDelayedSites(),
  ]);

  const workerNames = [
    ...new Set(
      schedules
        .map((s) => unwrapRelation(s.worker as Worker | Worker[] | null)?.full_name)
        .filter(Boolean) as string[]
    ),
  ];
  const siteNames = [
    ...new Set(
      schedules
        .map((s) => unwrapRelation(s.site as Site | Site[] | null)?.name)
        .filter(Boolean) as string[]
    ),
  ];

  const now = new Date();
  const sorted = [...schedules].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );
  const currentOrNext =
    sorted.find((s) => new Date(s.end_time) >= now) ?? sorted[0];

  let nextUp: MorningBriefing["nextUp"];
  if (currentOrNext) {
    const worker = unwrapRelation(currentOrNext.worker as Worker | Worker[] | null);
    const site = unwrapRelation(currentOrNext.site as Site | Site[] | null);
    nextUp = {
      worker_name: worker?.full_name ?? "作業員",
      site_name: site?.name ?? "現場",
      title: currentOrNext.title,
      time_label: formatTimeRange(currentOrNext.start_time, currentOrNext.end_time),
    };
  }

  const top = ranking[0];
  const worst = ranking[ranking.length - 1];

  return {
    workerCount: workerNames.length,
    scheduleCount: schedules.length,
    siteCount: siteNames.length,
    delayedCount: delayed.length,
    workerNames,
    siteNames,
    nextUp,
    topSite: top ? { name: top.name, progress: top.progress_percent } : undefined,
    worstSite:
      worst && worst.id !== top?.id
        ? { name: worst.name, progress: worst.progress_percent }
        : undefined,
  };
}

export async function getProgressRanking(): Promise<SiteWithProgress[]> {
  const sites = await getSites();
  return sites
    .filter((s) => s.status !== "completed" && s.task_count > 0)
    .sort((a, b) => b.progress_percent - a.progress_percent)
    .slice(0, 3);
}
