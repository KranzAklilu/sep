import { UserRole } from "@prisma/client";
import { z } from "zod";

export const userRegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([UserRole.Attendee, UserRole.EventPlanner, UserRole.VenueOwner]),
});

export const userUpdateSchema = z.object({
  name: z.string(),
  phone: z.string().min(7),
  address: z.string().min(7),
});
