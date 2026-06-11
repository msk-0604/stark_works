"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { DEMO_ORG_ID } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { SiteStatus, Worker, WorkerSiteHistory, WorkerTodaySchedule, WorkerWithOverview } from "@/lib/types/database";
import { toUserFacingDbError } from "@/lib/utils/supabase-error";
import { workerSchema } from "@/lib/validations/worker";

export type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

function emptyToNull(value: string | undefined): string | null {
  return value && value.trim() !== "" ? value.trim() : null;
}

function unwrapRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function parseQualifications(formData: FormData): string[] {
  return formData.getAll("qualifications").map(String).filter(Boolean);
}

export async function getWorkers(): Promise<Worker[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .eq("is_active", true)
    .order("full_name");

  if (error || !data) return [];
  return data.map((w) => ({ ...w, qualifications: w.qualifications ?? [] }));
}

export async function getWorkersOverview(): Promise<WorkerWithOverview[]> {
  const workers = await getWorkers();
  if (workers.length === 0 || !isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  const workerIds = workers.map((w) => w.id);

  const [schedulesResult, assignmentsResult] = await Promise.all([
    supabase
      .from("schedules")
      .select("id, worker_id, title, start_time, end_time, site_id, site:sites(id, name)")
      .gte("start_time", `${today}T00:00:00`)
      .lte("start_time", `${today}T23:59:59`)
      .in("worker_id", workerIds)
      .order("start_time"),
    supabase
      .from("site_assignments")
      .select("worker_id, site_id, created_at, site:sites(id, name, status)")
      .in("worker_id", workerIds)
      .order("created_at", { ascending: false }),
  ]);

  const schedulesByWorker = new Map<string, WorkerTodaySchedule[]>();
  for (const row of schedulesResult.data ?? []) {
    const site = unwrapRelation(row.site as { id: string; name: string } | { id: string; name: string }[] | null);
    const entry: WorkerTodaySchedule = {
      id: row.id,
      title: row.title,
      start_time: row.start_time,
      end_time: row.end_time,
      site_id: row.site_id,
      site_name: site?.name ?? "現場",
    };
    const list = schedulesByWorker.get(row.worker_id) ?? [];
    list.push(entry);
    schedulesByWorker.set(row.worker_id, list);
  }

  const historyByWorker = new Map<string, WorkerSiteHistory[]>();
  for (const row of assignmentsResult.data ?? []) {
    const site = unwrapRelation(
      row.site as { id: string; name: string; status: SiteStatus } | { id: string; name: string; status: SiteStatus }[] | null
    );
    if (!site) continue;
    const entry: WorkerSiteHistory = {
      site_id: site.id,
      site_name: site.name,
      site_status: site.status,
      assigned_at: row.created_at,
    };
    const list = historyByWorker.get(row.worker_id) ?? [];
    if (!list.some((h) => h.site_id === entry.site_id)) {
      list.push(entry);
    }
    historyByWorker.set(row.worker_id, list);
  }

  return workers.map((worker) => {
    const today_schedules = schedulesByWorker.get(worker.id) ?? [];
    return {
      ...worker,
      today_schedule_count: today_schedules.length,
      today_schedules,
      site_history: historyByWorker.get(worker.id) ?? [],
    };
  });
}

export async function getWorker(id: string): Promise<Worker | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("workers").select("*").eq("id", id).single();

  if (error) return null;
  return { ...data, qualifications: data.qualifications ?? [] };
}

export async function createWorker(formData: FormData): Promise<ActionResult<never>> {
  const parsed = workerSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    position: formData.get("position") || undefined,
    qualifications: parseQualifications(formData),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "入力内容を確認してください" };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase が未設定です" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("workers").insert({
    organization_id: DEMO_ORG_ID,
    full_name: parsed.data.full_name,
    phone: emptyToNull(parsed.data.phone),
    email: emptyToNull(parsed.data.email),
    position: emptyToNull(parsed.data.position),
    qualifications: parsed.data.qualifications,
  });

  if (error) {
    return { success: false, error: toUserFacingDbError("メンバーの登録に失敗しました", error) };
  }

  revalidatePath("/workers");
  revalidatePath("/dashboard");
  redirect("/workers");
}

export async function updateWorker(id: string, formData: FormData): Promise<ActionResult<never>> {
  const parsed = workerSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    position: formData.get("position") || undefined,
    qualifications: parseQualifications(formData),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "入力内容を確認してください" };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase が未設定です" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("workers")
    .update({
      full_name: parsed.data.full_name,
      phone: emptyToNull(parsed.data.phone),
      email: emptyToNull(parsed.data.email),
      position: emptyToNull(parsed.data.position),
      qualifications: parsed.data.qualifications,
    })
    .eq("id", id);

  if (error) return { success: false, error: "メンバーの更新に失敗しました" };

  revalidatePath("/workers");
  revalidatePath("/dashboard");
  redirect("/workers");
}

export async function deleteWorker(id: string): Promise<ActionResult<never>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase が未設定です" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("workers").update({ is_active: false }).eq("id", id);

  if (error) return { success: false, error: "メンバーの削除に失敗しました" };

  revalidatePath("/workers");
  revalidatePath("/dashboard");
  redirect("/workers");
}
