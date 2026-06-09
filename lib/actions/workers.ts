"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { DEMO_ORG_ID } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Worker } from "@/lib/types/database";
import { workerSchema } from "@/lib/validations/worker";

export type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

function emptyToNull(value: string | undefined): string | null {
  return value && value.trim() !== "" ? value.trim() : null;
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
  return data;
}

export async function getWorker(id: string): Promise<Worker | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("workers").select("*").eq("id", id).single();

  if (error) return null;
  return data;
}

export async function createWorker(formData: FormData): Promise<ActionResult<never>> {
  const parsed = workerSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    position: formData.get("position") || undefined,
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
  });

  if (error) return { success: false, error: "作業員の登録に失敗しました" };

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
    })
    .eq("id", id);

  if (error) return { success: false, error: "作業員の更新に失敗しました" };

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

  if (error) return { success: false, error: "作業員の削除に失敗しました" };

  revalidatePath("/workers");
  revalidatePath("/dashboard");
  redirect("/workers");
}
