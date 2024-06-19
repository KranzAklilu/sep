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
  description: z.string().optional(),
  tag: z.number().optional(),
  session: z.array(z.string()),
});

export const eventEditSchema = eventOrderSchema.omit({ venue: true });
export const eventPostponeSchema = eventOrderSchema.pick({
  date: true,
  startTime: true,
  endTime: true,
});
