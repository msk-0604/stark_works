-- Stark Works: デモ用 RLS（ログインなしでデータ閲覧・編集可能）
-- 001_initial_schema.sql の後に実行してください

CREATE POLICY "demo_anon_select_organizations" ON organizations
  FOR SELECT TO anon USING (true);

CREATE POLICY "demo_anon_all_workers" ON workers
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "demo_anon_all_sites" ON sites
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "demo_anon_all_site_assignments" ON site_assignments
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "demo_anon_all_tasks" ON tasks
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "demo_anon_select_task_logs" ON task_logs
  FOR SELECT TO anon USING (true);

CREATE POLICY "demo_anon_all_schedules" ON schedules
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "demo_anon_all_photos" ON photos
  FOR ALL TO anon USING (true) WITH CHECK (true);

GRANT SELECT ON site_progress TO anon;
