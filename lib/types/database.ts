export type UserRole = "admin" | "worker";

export type SiteStatus = "not_started" | "in_progress" | "on_hold" | "completed";

export type PhotoCategory = "before" | "during" | "after";

export interface Worker {
  id: string;
  organization_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  position: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  organization_id: string;
  name: string;
  customer_name: string | null;
  address: string | null;
  phone: string | null;
  start_date: string | null;
  expected_end_date: string | null;
  manager_id: string | null;
  status: SiteStatus;
  created_at: string;
  updated_at: string;
  manager?: Worker | null;
}

export interface SiteWithProgress extends Site {
  task_count: number;
  completed_count: number;
  progress_percent: number;
}

export interface Task {
  id: string;
  site_id: string;
  organization_id: string;
  title: string;
  sort_order: number;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  created_at: string;
  completed_worker?: Worker | null;
}

export const SITE_STATUS_LABELS: Record<SiteStatus, string> = {
  not_started: "未着工",
  in_progress: "作業中",
  on_hold: "保留",
  completed: "完了",
};

export const PHOTO_CATEGORY_LABELS: Record<PhotoCategory, string> = {
  before: "着工前",
  during: "作業中",
  after: "完了後",
};

export interface Photo {
  id: string;
  site_id: string;
  organization_id: string;
  storage_path: string;
  category: PhotoCategory;
  file_name: string | null;
  created_at: string;
  url?: string;
}

export interface Schedule {
  id: string;
  organization_id: string;
  site_id: string;
  worker_id: string;
  title: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  site?: Site;
  worker?: Worker;
}
