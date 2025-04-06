import { z } from "zod";

export const userTableSchema = z.object({
  id: z.coerce.number().min(1).max(400000),
  name: z.string().min(1).max(50),
  description: z.string().max(1000),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
});
