import { UserRole } from "@prisma/client";
import { z } from "zod";

export const userRegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([UserRole.Attendee, UserRole.EventPlanner, UserRole.VenueOwner]),
});
