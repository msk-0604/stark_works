-- Stark Works: 写真アップロード用（デモ・ログインなし）
-- 002_demo_rls.sql の後に実行

UPDATE storage.buckets SET public = true WHERE id = 'site-photos';

CREATE POLICY "demo_anon_storage_select" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'site-photos');

CREATE POLICY "demo_anon_storage_insert" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'site-photos');

CREATE POLICY "demo_anon_storage_delete" ON storage.objects
  FOR DELETE TO anon USING (bucket_id = 'site-photos');
