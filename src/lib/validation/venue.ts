import { z } from "zod";

export const venueCreateSchema = z.object({
  name: z.string(),
  description: z.string(),
  location: z.string(),
  lng: z.number().optional(),
  lat: z.number().optional(),
  phone: z.string(),
  pricePerHour: z.coerce.number(),
  openHour: z.string(),
  closeHour: z.string(),
  availableDate: z.array(z.coerce.number()),
  capacity: z.coerce.number(),
});
export const venueUpdateSchema = venueCreateSchema.extend({
  username: z.string(),
});
