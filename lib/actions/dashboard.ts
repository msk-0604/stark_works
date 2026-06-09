"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

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
  if (!isSupabaseConfigured()) {
    return emptyStats;
  }

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [schedulesResult, inProgressResult, completedResult, workersResult] =
    await Promise.all([
      supabase.from("schedules").select("site_id").gte("start_time", `${today}T00:00:00`),
      supabase.from("sites").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
      supabase.from("sites").select("id", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("workers").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);

  const uniqueSiteIds = new Set(
    (schedulesResult.data ?? []).map((s) => s.site_id)
  );

  return {
    todaySites: uniqueSiteIds.size,
    inProgressSites: inProgressResult.count ?? 0,
    completedSites: completedResult.count ?? 0,
    workerCount: workersResult.count ?? 0,
  };
}
