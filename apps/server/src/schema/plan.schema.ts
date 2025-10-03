import { z } from "zod";

export const CreatePlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  duration: z.number().int().positive("Duration must be a positive integer"),
  durationType: z.enum(["days", "weeks", "months"]).default("days"),
  planType: z.enum(["unlimited", "session"]).default("unlimited"),
  sessionCount: z.number().int().positive().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const UpdatePlanSchema = z.object({
  name: z.string().min(1, "Plan name is required").optional(),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive").optional(),
  duration: z.number().int().positive("Duration must be a positive integer").optional(),
  durationType: z.enum(["days", "weeks", "months"]).optional(),
  planType: z.enum(["unlimited", "session"]).optional(),
  sessionCount: z.number().int().positive().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;
export type UpdatePlanInput = z.infer<typeof UpdatePlanSchema>;