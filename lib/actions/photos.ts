"use server";

import { revalidatePath } from "next/cache";

import { DEMO_ORG_ID } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";
import type { Photo, PhotoCategory } from "@/lib/types/database";

export type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function getPhotos(siteId: string): Promise<Photo[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const { url } = getSupabaseConfig();
  return data.map((photo) => ({
    ...photo,
    url: `${url}/storage/v1/object/public/site-photos/${photo.storage_path}`,
  }));
}

export async function uploadPhoto(
  siteId: string,
  formData: FormData
): Promise<ActionResult<Photo>> {
  const file = formData.get("file") as File | null;
  const category = formData.get("category") as PhotoCategory;

  if (!file || file.size === 0) {
    return { success: false, error: "写真を選んでください" };
  }

  if (!["before", "during", "after"].includes(category)) {
    return { success: false, error: "カテゴリを選んでください" };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase が未設定です" };
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const storagePath = `${DEMO_ORG_ID}/${siteId}/${category}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("site-photos")
    .upload(storagePath, file, { contentType: file.type });

  if (uploadError) {
    return { success: false, error: "写真のアップロードに失敗しました" };
  }

  const { data, error } = await supabase
    .from("photos")
    .insert({
      site_id: siteId,
      organization_id: DEMO_ORG_ID,
      storage_path: storagePath,
      category,
      file_name: file.name,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: "写真の保存に失敗しました" };
  }

  revalidatePath(`/sites/${siteId}`);
  const { url } = getSupabaseConfig();
  return {
    success: true,
    data: { ...data, url: `${url}/storage/v1/object/public/site-photos/${storagePath}` },
  };
}

export async function deletePhoto(photoId: string, siteId: string): Promise<ActionResult<never>> {
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase が未設定です" };

  const supabase = await createClient();
  const { data: photo } = await supabase.from("photos").select("storage_path").eq("id", photoId).single();

  if (photo) {
    await supabase.storage.from("site-photos").remove([photo.storage_path]);
  }

  const { error } = await supabase.from("photos").delete().eq("id", photoId);
  if (error) return { success: false, error: "写真の削除に失敗しました" };

  revalidatePath(`/sites/${siteId}`);
  return { success: true, data: undefined as never };
}
