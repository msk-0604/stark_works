export function toUserFacingDbError(
  fallback: string,
  error: { code?: string; message?: string }
): string {
  if (error.code === "42501") {
    return "データベースの権限が不足しています。Supabase で 002_demo_rls.sql または 006_demo_fix.sql を実行してください。";
  }
  if (error.code === "23503") {
    return "デモ組織が未作成です。Supabase で seed.sql または 006_demo_fix.sql を実行してください。";
  }
  if (error.message?.includes("qualifications")) {
    return "資格カラムがありません。Supabase で 005_worker_qualifications.sql を実行してください。";
  }
  if (error.message) {
    return `${fallback}（${error.message}）`;
  }
  return fallback;
}
