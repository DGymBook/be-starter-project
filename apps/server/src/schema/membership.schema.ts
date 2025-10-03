import { z } from "zod";

export const CreateMembershipSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  planId: z.string().min(1, "Plan ID is required"),
  startDate: z.string().optional(),
  status: z.enum(["active", "expired", "paused", "cancelled"]).default("active"),
});

export const UpdateMembershipSchema = z.object({
  status: z.enum(["active", "expired", "paused", "cancelled"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateMembershipInput = z.infer<typeof CreateMembershipSchema>;
export type UpdateMembershipInput = z.infer<typeof UpdateMembershipSchema>;