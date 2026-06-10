"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { DEMO_ORG_ID } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Site, SiteListItem, SiteWithProgress, Worker } from "@/lib/types/database";
import { calcProgress } from "@/lib/utils/progress";
import { isSiteOverdue } from "@/lib/utils/site";
import { unwrapRelation } from "@/lib/utils/unwrap-relation";
import { siteSchema } from "@/lib/validations/site";

export type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

function emptyToNull(value: string | undefined): string | null {
  return value && value.trim() !== "" ? value.trim() : null;
}

export async function getSites(): Promise<SiteWithProgress[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data: sites, error } = await supabase
    .from("sites")
    .select("*, manager:workers!sites_manager_id_fkey(*)")
    .order("created_at", { ascending: false });

  if (error || !sites) return [];

  const { data: tasks } = await supabase.from("tasks").select("site_id, is_completed");

  const taskMap = new Map<string, { total: number; completed: number }>();
  for (const task of tasks ?? []) {
    const current = taskMap.get(task.site_id) ?? { total: 0, completed: 0 };
    current.total++;
    if (task.is_completed) current.completed++;
    taskMap.set(task.site_id, current);
  }

  return sites.map((site) => {
    const counts = taskMap.get(site.id) ?? { total: 0, completed: 0 };
    return {
      ...site,
      task_count: counts.total,
      completed_count: counts.completed,
      progress_percent: calcProgress(counts.completed, counts.total),
    };
  });
}

export async function getSitesForList(): Promise<SiteListItem[]> {
  const sites = await getSites();
  if (sites.length === 0 || !isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [schedulesResult, assignmentsResult] = await Promise.all([
    supabase
      .from("schedules")
      .select("site_id, worker_id, worker:workers(full_name)")
      .gte("start_time", `${today}T00:00:00`)
      .lte("start_time", `${today}T23:59:59`),
    supabase
      .from("site_assignments")
      .select("site_id, worker:workers(full_name)"),
  ]);

  const todayWorkersBySite = new Map<string, { count: number; names: string[] }>();
  for (const row of schedulesResult.data ?? []) {
    const worker = unwrapRelation(row.worker as { full_name: string } | { full_name: string }[] | null);
    const entry = todayWorkersBySite.get(row.site_id) ?? { count: 0, names: [] };
    if (worker?.full_name && !entry.names.includes(worker.full_name)) {
      entry.names.push(worker.full_name);
      entry.count++;
    }
    todayWorkersBySite.set(row.site_id, entry);
  }

  const assigneesBySite = new Map<string, string[]>();
  for (const row of assignmentsResult.data ?? []) {
    const worker = unwrapRelation(row.worker as { full_name: string } | { full_name: string }[] | null);
    if (!worker?.full_name) continue;
    const list = assigneesBySite.get(row.site_id) ?? [];
    if (!list.includes(worker.full_name)) list.push(worker.full_name);
    assigneesBySite.set(row.site_id, list);
  }

  return sites.map((site) => {
    const manager = unwrapRelation(site.manager as Worker | Worker[] | null);
    const todayInfo = todayWorkersBySite.get(site.id) ?? { count: 0, names: [] };
    const assigned = assigneesBySite.get(site.id) ?? [];
    const assigneeNames = [
      ...new Set([manager?.full_name, ...assigned].filter(Boolean) as string[]),
    ];

    return {
      ...site,
      manager: manager ?? site.manager,
      assignee_name: manager?.full_name ?? assigned[0] ?? null,
      assignee_names: assigneeNames,
      today_worker_count: todayInfo.count,
      is_overdue: isSiteOverdue(site.expected_end_date, site.status),
      is_active_today: todayInfo.count > 0,
    };
  });
}

export async function getSite(id: string): Promise<Site | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sites")
    .select("*, manager:workers!sites_manager_id_fkey(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createSite(formData: FormData): Promise<ActionResult<never>> {
  const parsed = siteSchema.safeParse({
    name: formData.get("name"),
    customer_name: formData.get("customer_name") || undefined,
    address: formData.get("address") || undefined,
    phone: formData.get("phone") || undefined,
    start_date: formData.get("start_date") || undefined,
    expected_end_date: formData.get("expected_end_date") || undefined,
    manager_id: formData.get("manager_id") || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "入力内容を確認してください" };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase が未設定です" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("sites").insert({
    organization_id: DEMO_ORG_ID,
    name: parsed.data.name,
    customer_name: emptyToNull(parsed.data.customer_name),
    address: emptyToNull(parsed.data.address),
    phone: emptyToNull(parsed.data.phone),
    start_date: emptyToNull(parsed.data.start_date),
    expected_end_date: emptyToNull(parsed.data.expected_end_date),
    manager_id: emptyToNull(parsed.data.manager_id),
    status: parsed.data.status,
  });

  if (error) return { success: false, error: "現場の登録に失敗しました" };

  revalidatePath("/sites");
  revalidatePath("/dashboard");
  redirect("/sites");
}

export async function updateSite(id: string, formData: FormData): Promise<ActionResult<never>> {
  const parsed = siteSchema.safeParse({
    name: formData.get("name"),
    customer_name: formData.get("customer_name") || undefined,
    address: formData.get("address") || undefined,
    phone: formData.get("phone") || undefined,
    start_date: formData.get("start_date") || undefined,
    expected_end_date: formData.get("expected_end_date") || undefined,
    manager_id: formData.get("manager_id") || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "入力内容を確認してください" };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase が未設定です" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("sites")
    .update({
      name: parsed.data.name,
      customer_name: emptyToNull(parsed.data.customer_name),
      address: emptyToNull(parsed.data.address),
      phone: emptyToNull(parsed.data.phone),
      start_date: emptyToNull(parsed.data.start_date),
      expected_end_date: emptyToNull(parsed.data.expected_end_date),
      manager_id: emptyToNull(parsed.data.manager_id),
      status: parsed.data.status,
    })
    .eq("id", id);

  if (error) return { success: false, error: "現場の更新に失敗しました" };

  revalidatePath("/sites");
  revalidatePath(`/sites/${id}`);
  revalidatePath("/dashboard");
  redirect(`/sites/${id}`);
}

export async function deleteSite(id: string): Promise<ActionResult<never>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase が未設定です" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("sites").delete().eq("id", id);

  if (error) return { success: false, error: "現場の削除に失敗しました" };

  revalidatePath("/sites");
  revalidatePath("/dashboard");
  redirect("/sites");
}
