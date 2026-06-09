"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { DEMO_ORG_ID } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Site, SiteWithProgress } from "@/lib/types/database";
import { calcProgress } from "@/lib/utils/progress";
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
