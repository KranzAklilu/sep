import { z } from "zod";

export const eventOrderSchema = z.object({
  name: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  venue: z.string(),
  date: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  attendeeLimit: z.coerce.number(),
  price: z.coerce.number(),
  description: z.string(),
  tag: z.number().optional(),
});

export const eventEditSchema = eventOrderSchema.omit({ venue: true });
