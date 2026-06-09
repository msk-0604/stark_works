# Stark Works

建設業・設備業・水道業向け現場進捗管理システム  
60代の方でも使いやすい、大きな文字・大きなボタン設計

## 起動

```bash
npm install
npm run dev
```

http://localhost:3000

## Supabase 設定（初回のみ）

SQL Editor で順番に実行:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_demo_rls.sql`
3. `supabase/migrations/003_demo_storage.sql`
4. `supabase/migrations/004_fix_photos.sql`
5. （任意）`supabase/seed.sql`

`.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 機能

- ダッシュボード（本日の現場・作業中・完了・作業員数）
- 現場管理（登録・編集・削除・進捗率）
- 作業チェックリスト（大きな「完了」ボタン）
- 写真管理（着工前 / 作業中 / 完了後）
- スケジュール（日 / 週 / 月表示）
- 作業員管理

## Vercel デプロイ

1. GitHub にプッシュ
2. https://vercel.com でインポート
3. 環境変数（上記3つ）を設定
4. Deploy

## ドキュメント

- [仕様書](docs/SPECIFICATION.md)
- [設計書](docs/DESIGN.md)

## 実装状況

- [x] Phase 1: 基盤・レイアウト
- [x] Phase 2: 現場・作業員・チェックリスト
- [x] Phase 3: 写真・スケジュール
- [x] Phase 4: 60代向けUI・仕上げ
