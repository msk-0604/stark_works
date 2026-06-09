import { z } from "zod";

export const siteSchema = z.object({
  name: z.string().min(1, "現場名を入力してください"),
  customer_name: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  start_date: z.string().optional(),
  expected_end_date: z.string().optional(),
  manager_id: z.string().optional(),
  status: z.enum(["not_started", "in_progress", "on_hold", "completed"]),
});

export type SiteFormData = z.infer<typeof siteSchema>;
