import type { Context, Next } from "hono";
import { validator } from "hono/validator";
import type { z } from "zod";

export const ValidationMiddleware = <T extends z.ZodSchema>(schema: T) => {
  return validator("json", (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        400
      );
    }
    return parsed.data;
  });
};