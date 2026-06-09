"use server";

import { revalidatePath } from "next/cache";

import { DEMO_ORG_ID } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Schedule } from "@/lib/types/database";
import { scheduleSchema } from "@/lib/validations/schedule";

export type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function getSchedules(start: string, end: string): Promise<Schedule[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schedules")
    .select("*, site:sites(*), worker:workers(*)")
    .gte("start_time", start)
    .lte("start_time", end)
    .order("start_time");

  if (error || !data) return [];
  return data;
}

export async function createSchedule(formData: FormData): Promise<ActionResult<Schedule>> {
  const parsed = scheduleSchema.safeParse({
    site_id: formData.get("site_id"),
    worker_id: formData.get("worker_id"),
    title: formData.get("title"),
    date: formData.get("date"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "入力を確認してください" };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase が未設定です" };
  }

  const { date, start_time, end_time, ...rest } = parsed.data;
  const startDateTime = `${date}T${start_time}:00`;
  const endDateTime = `${date}T${end_time}:00`;

  if (endDateTime <= startDateTime) {
    return { success: false, error: "終了時間は開始時間より後にしてください" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schedules")
    .insert({
      organization_id: DEMO_ORG_ID,
      site_id: rest.site_id,
      worker_id: rest.worker_id,
      title: rest.title,
      start_time: startDateTime,
      end_time: endDateTime,
    })
    .select("*, site:sites(*), worker:workers(*)")
    .single();

  if (error || !data) return { success: false, error: "予定の登録に失敗しました" };

  revalidatePath("/schedule");
  revalidatePath("/dashboard");
  return { success: true, data };
}

export async function deleteSchedule(id: string): Promise<ActionResult<never>> {
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase が未設定です" };

  const supabase = await createClient();
  const { error } = await supabase.from("schedules").delete().eq("id", id);

  if (error) return { success: false, error: "予定の削除に失敗しました" };

  revalidatePath("/schedule");
  revalidatePath("/dashboard");
  return { success: true, data: undefined as never };
}
