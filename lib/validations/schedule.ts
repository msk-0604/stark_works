import { z } from "zod";

export const scheduleSchema = z.object({
  site_id: z.string().min(1, "現場を選んでください"),
  worker_id: z.string().min(1, "担当を選んでください"),
  title: z.string().min(1, "作業内容を入力してください"),
  date: z.string().min(1, "日付を選んでください"),
  start_time: z.string().min(1, "開始時間を選んでください"),
  end_time: z.string().min(1, "終了時間を選んでください"),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;
