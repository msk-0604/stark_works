import { z } from "zod";

export const workerSchema = z.object({
  full_name: z.string().min(1, "氏名を入力してください"),
  phone: z.string().optional(),
  email: z.string().email("正しいメールアドレスを入力してください").optional().or(z.literal("")),
  position: z.string().optional(),
});

export type WorkerFormData = z.infer<typeof workerSchema>;
