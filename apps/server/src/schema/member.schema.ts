import { z } from "zod";

export const CreateMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const UpdateMemberSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type CreateMemberInput = z.infer<typeof CreateMemberSchema>;
export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>;