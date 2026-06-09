-- デモ環境の登録エラー修正（再実行可能）
-- 「作業員の登録に失敗しました」が出る場合に実行

-- デモ組織（外部キー用）
INSERT INTO organizations (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', '滋賀設備工業株式会社')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 資格カラム（005 未実行の場合）
ALTER TABLE workers
  ADD COLUMN IF NOT EXISTS qualifications TEXT[] NOT NULL DEFAULT '{}';

-- anon 用デモポリシー（002 未実行・不足の場合）
DO $$ BEGIN
  CREATE POLICY "demo_anon_select_organizations" ON organizations
    FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "demo_anon_all_workers" ON workers
    FOR ALL TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "demo_anon_all_sites" ON sites
    FOR ALL TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "demo_anon_all_site_assignments" ON site_assignments
    FOR ALL TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "demo_anon_all_tasks" ON tasks
    FOR ALL TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "demo_anon_all_schedules" ON schedules
    FOR ALL TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "demo_anon_all_photos" ON photos
    FOR ALL TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

GRANT SELECT ON site_progress TO anon;
