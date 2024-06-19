import { UserRole } from "@prisma/client";
import { z } from "zod";

export const userRegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([
    UserRole.Attendee,
    UserRole.EventPlanner,
    UserRole.VenueOwner,
    UserRole.Vendor,
  ]),
});

export const userUpdateSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(7).optional(),
  address: z.string().min(7).optional(),
  licenceDocument: z.string().optional(),
  telebirr: z.string().optional(),
  cbe: z.string().optional(),
  boa: z.string().optional(),
});
