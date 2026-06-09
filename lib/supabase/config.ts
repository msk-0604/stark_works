function readEnv(...keys: string[]): string {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return "";
}

export function getSupabaseConfig(): { url: string; key: string } {
  return {
    // サーバー実行時に読む（Vercel でビルド後も有効）
    url: readEnv("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"),
    key: readEnv("SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseConfig();
  return (
    url.length > 0 &&
    key.length > 0 &&
    !url.includes("placeholder") &&
    key !== "placeholder-key"
  );
}
