-- 作業員の資格管理
ALTER TABLE workers
  ADD COLUMN IF NOT EXISTS qualifications TEXT[] NOT NULL DEFAULT '{}';
