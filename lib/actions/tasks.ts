"use server";

import { revalidatePath } from "next/cache";

import { DEMO_ORG_ID } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Task } from "@/lib/types/database";

export type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function getTasks(siteId: string): Promise<Task[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*, completed_worker:workers!tasks_completed_by_fkey(*)")
    .eq("site_id", siteId)
    .order("sort_order");

  if (error || !data) return [];
  return data;
}

export async function createTask(siteId: string, title: string): Promise<ActionResult<Task>> {
  if (!title.trim()) return { success: false, error: "作業名を入力してください" };
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase が未設定です" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("tasks")
    .select("sort_order")
    .eq("site_id", siteId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      site_id: siteId,
      organization_id: DEMO_ORG_ID,
      title: title.trim(),
      sort_order: nextOrder,
    })
    .select()
    .single();

  if (error || !data) return { success: false, error: "作業の追加に失敗しました" };

  revalidatePath(`/sites/${siteId}`);
  revalidatePath("/sites");
  revalidatePath("/dashboard");
  return { success: true, data };
}

export async function completeTask(taskId: string, siteId: string): Promise<ActionResult<never>> {
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase が未設定です" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({
      is_completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", taskId);

  if (error) return { success: false, error: "完了の登録に失敗しました" };

  revalidatePath(`/sites/${siteId}`);
  revalidatePath("/sites");
  revalidatePath("/dashboard");
  return { success: true, data: undefined as never };
}

export async function deleteTask(taskId: string, siteId: string): Promise<ActionResult<never>> {
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase が未設定です" };

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) return { success: false, error: "作業の削除に失敗しました" };

  revalidatePath(`/sites/${siteId}`);
  revalidatePath("/sites");
  revalidatePath("/dashboard");
  return { success: true, data: undefined as never };
}
