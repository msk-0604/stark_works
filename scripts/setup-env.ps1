# Stark Works: Supabase 接続設定（データ保存用・任意）
# 使い方: PowerShell で .\scripts\setup-env.ps1 を実行

Write-Host ""
Write-Host "Stark Works - Supabase 設定（任意）" -ForegroundColor Cyan
Write-Host "https://supabase.com/dashboard -> Settings -> API" -ForegroundColor Yellow
Write-Host ""

$url = Read-Host "Project URL"
$key = Read-Host "anon public key"

if ([string]::IsNullOrWhiteSpace($url) -or [string]::IsNullOrWhiteSpace($key)) {
  Write-Host "エラー: URL と Key の両方が必要です" -ForegroundColor Red
  exit 1
}

$envPath = Join-Path (Split-Path $PSScriptRoot -Parent) ".env.local"

@"
NEXT_PUBLIC_SUPABASE_URL=$url
NEXT_PUBLIC_SUPABASE_ANON_KEY=$key
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@ | Set-Content -Path $envPath -Encoding UTF8

Write-Host "OK: .env.local を保存しました。npm run dev を再起動してください。" -ForegroundColor Green
