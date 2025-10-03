import { z } from "zod";

export const CreateGymSchema = z.object({
  name: z.string().min(1, "Gym name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const UpdateGymSchema = z.object({
  name: z.string().min(1, "Gym name is required").optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type CreateGymInput = z.infer<typeof CreateGymSchema>;
export type UpdateGymInput = z.infer<typeof UpdateGymSchema>;