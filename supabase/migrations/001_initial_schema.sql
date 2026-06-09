-- Stark Works: Initial Schema
-- 建設業向け現場進捗管理システム

-- ============================================================
-- Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Enums (text + CHECK で管理し、TypeScript と同期しやすくする)
-- ============================================================

-- ============================================================
-- organizations（テナント）
-- ============================================================
CREATE TABLE organizations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- workers（作業員マスタ）
-- ============================================================
CREATE TABLE workers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  position        TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workers_organization ON workers(organization_id);

-- ============================================================
-- profiles（ユーザープロフィール）
-- ============================================================
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'worker'
                  CHECK (role IN ('admin', 'worker')),
  worker_id       UUID REFERENCES workers(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_organization ON profiles(organization_id);

-- ============================================================
-- sites（現場）
-- ============================================================
CREATE TABLE sites (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  customer_name     TEXT,
  address           TEXT,
  phone             TEXT,
  start_date        DATE,
  expected_end_date DATE,
  manager_id        UUID REFERENCES workers(id) ON DELETE SET NULL,
  status            TEXT NOT NULL DEFAULT 'not_started'
                    CHECK (status IN ('not_started', 'in_progress', 'on_hold', 'completed')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sites_organization ON sites(organization_id);
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_sites_manager ON sites(manager_id);

-- ============================================================
-- site_assignments（現場担当割当）
-- ============================================================
CREATE TABLE site_assignments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id         UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  worker_id       UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (site_id, worker_id)
);

CREATE INDEX idx_site_assignments_worker ON site_assignments(worker_id);
CREATE INDEX idx_site_assignments_site ON site_assignments(site_id);

-- ============================================================
-- tasks（作業チェックリスト）
-- ============================================================
CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id         UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  sort_order      INT NOT NULL DEFAULT 0,
  is_completed    BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  completed_by    UUID REFERENCES workers(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_site ON tasks(site_id);

-- ============================================================
-- task_logs（作業完了ログ）
-- ============================================================
CREATE TABLE task_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  site_id         UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  action          TEXT NOT NULL CHECK (action IN ('completed', 'reopened')),
  performed_by    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  performed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note            TEXT
);

CREATE INDEX idx_task_logs_task ON task_logs(task_id);
CREATE INDEX idx_task_logs_site ON task_logs(site_id);

-- ============================================================
-- schedules（スケジュール）
-- ============================================================
CREATE TABLE schedules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  site_id         UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  worker_id       UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  start_time      TIMESTAMPTZ NOT NULL,
  end_time        TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_time > start_time)
);

CREATE INDEX idx_schedules_org ON schedules(organization_id);
CREATE INDEX idx_schedules_worker ON schedules(worker_id);
CREATE INDEX idx_schedules_time ON schedules(start_time, end_time);

-- ============================================================
-- photos（現場写真メタデータ）
-- ============================================================
CREATE TABLE photos (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id         UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  uploaded_by     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  storage_path    TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('before', 'during', 'after')),
  file_name       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_photos_site ON photos(site_id);

-- ============================================================
-- 進捗率ビュー
-- ============================================================
CREATE VIEW site_progress AS
SELECT
  s.id AS site_id,
  s.organization_id,
  COUNT(t.id) AS task_count,
  COUNT(t.id) FILTER (WHERE t.is_completed) AS completed_count,
  CASE
    WHEN COUNT(t.id) = 0 THEN 0
    ELSE ROUND((COUNT(t.id) FILTER (WHERE t.is_completed)::NUMERIC / COUNT(t.id)) * 100)
  END AS progress_percent
FROM sites s
LEFT JOIN tasks t ON t.site_id = s.id
GROUP BY s.id, s.organization_id;

-- ============================================================
-- updated_at 自動更新トリガー
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_workers_updated_at
  BEFORE UPDATE ON workers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 新規ユーザー登録時に profiles を自動作成する関数
-- （招待フローで organization_id を設定）
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, organization_id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'organization_id')::UUID, '00000000-0000-0000-0000-000000000000'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'worker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- タスク完了時に task_logs を自動記録
-- ============================================================
CREATE OR REPLACE FUNCTION log_task_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_performed_by UUID;
BEGIN
  IF NEW.is_completed = TRUE AND (OLD.is_completed IS DISTINCT FROM TRUE) THEN
    SELECT p.id INTO v_performed_by
    FROM profiles p
    WHERE p.worker_id = NEW.completed_by
    LIMIT 1;

    IF v_performed_by IS NOT NULL THEN
      INSERT INTO task_logs (task_id, site_id, organization_id, action, performed_by)
      VALUES (NEW.id, NEW.site_id, NEW.organization_id, 'completed', v_performed_by);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_task_completion_log
  AFTER UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION log_task_completion();

-- ============================================================
-- RLS ヘルパー関数
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_worker_id()
RETURNS UUID AS $$
  SELECT worker_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION user_has_site_access(p_site_id UUID)
RETURNS BOOLEAN AS $$
  SELECT CASE
    WHEN get_user_role() = 'admin' THEN TRUE
    WHEN EXISTS (
      SELECT 1 FROM site_assignments sa
      WHERE sa.site_id = p_site_id
        AND sa.worker_id = get_user_worker_id()
    ) THEN TRUE
    ELSE FALSE
  END;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- organizations
CREATE POLICY "org_select" ON organizations
  FOR SELECT USING (id = get_user_organization_id());

-- profiles
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- workers（admin のみ CRUD、worker は閲覧のみ）
CREATE POLICY "workers_select" ON workers
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "workers_insert" ON workers
  FOR INSERT WITH CHECK (
    organization_id = get_user_organization_id()
    AND get_user_role() = 'admin'
  );

CREATE POLICY "workers_update" ON workers
  FOR UPDATE USING (
    organization_id = get_user_organization_id()
    AND get_user_role() = 'admin'
  );

CREATE POLICY "workers_delete" ON workers
  FOR DELETE USING (
    organization_id = get_user_organization_id()
    AND get_user_role() = 'admin'
  );

-- sites
CREATE POLICY "sites_select" ON sites
  FOR SELECT USING (
    organization_id = get_user_organization_id()
    AND (
      get_user_role() = 'admin'
      OR user_has_site_access(id)
    )
  );

CREATE POLICY "sites_insert" ON sites
  FOR INSERT WITH CHECK (
    organization_id = get_user_organization_id()
    AND get_user_role() = 'admin'
  );

CREATE POLICY "sites_update" ON sites
  FOR UPDATE USING (
    organization_id = get_user_organization_id()
    AND get_user_role() = 'admin'
  );

CREATE POLICY "sites_delete" ON sites
  FOR DELETE USING (
    organization_id = get_user_organization_id()
    AND get_user_role() = 'admin'
  );

-- site_assignments
CREATE POLICY "site_assignments_select" ON site_assignments
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "site_assignments_manage" ON site_assignments
  FOR ALL USING (
    organization_id = get_user_organization_id()
    AND get_user_role() = 'admin'
  );

-- tasks
CREATE POLICY "tasks_select" ON tasks
  FOR SELECT USING (
    organization_id = get_user_organization_id()
    AND user_has_site_access(site_id)
  );

CREATE POLICY "tasks_insert" ON tasks
  FOR INSERT WITH CHECK (
    organization_id = get_user_organization_id()
    AND get_user_role() = 'admin'
    AND user_has_site_access(site_id)
  );

CREATE POLICY "tasks_update" ON tasks
  FOR UPDATE USING (
    organization_id = get_user_organization_id()
    AND user_has_site_access(site_id)
  );

CREATE POLICY "tasks_delete" ON tasks
  FOR DELETE USING (
    organization_id = get_user_organization_id()
    AND get_user_role() = 'admin'
  );

-- task_logs
CREATE POLICY "task_logs_select" ON task_logs
  FOR SELECT USING (
    organization_id = get_user_organization_id()
    AND user_has_site_access(site_id)
  );

CREATE POLICY "task_logs_insert" ON task_logs
  FOR INSERT WITH CHECK (
    organization_id = get_user_organization_id()
    AND user_has_site_access(site_id)
  );

-- schedules
CREATE POLICY "schedules_select" ON schedules
  FOR SELECT USING (
    organization_id = get_user_organization_id()
    AND (
      get_user_role() = 'admin'
      OR worker_id = get_user_worker_id()
    )
  );

CREATE POLICY "schedules_manage" ON schedules
  FOR ALL USING (
    organization_id = get_user_organization_id()
    AND get_user_role() = 'admin'
  );

-- photos
CREATE POLICY "photos_select" ON photos
  FOR SELECT USING (
    organization_id = get_user_organization_id()
    AND user_has_site_access(site_id)
  );

CREATE POLICY "photos_insert" ON photos
  FOR INSERT WITH CHECK (
    organization_id = get_user_organization_id()
    AND user_has_site_access(site_id)
  );

CREATE POLICY "photos_delete" ON photos
  FOR DELETE USING (
    organization_id = get_user_organization_id()
    AND get_user_role() = 'admin'
  );

-- ============================================================
-- Storage バケット
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-photos', 'site-photos', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "photos_storage_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'site-photos'
    AND (storage.foldername(name))[1] = get_user_organization_id()::TEXT
  );

CREATE POLICY "photos_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'site-photos'
    AND (storage.foldername(name))[1] = get_user_organization_id()::TEXT
  );

CREATE POLICY "photos_storage_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'site-photos'
    AND (storage.foldername(name))[1] = get_user_organization_id()::TEXT
    AND get_user_role() = 'admin'
  );
