import { z } from "zod";

export const venueCreateSchema = z.object({
  name: z.string(),
  description: z.string(),
  location: z.string(),
  phone: z.string(),
  pricePerHour: z.coerce.number(),
  openHour: z.string(),
  closeHour: z.string(),
  availableDate: z.array(z.coerce.number()),
  capacity: z.coerce.number(),
});
