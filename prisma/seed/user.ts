import { UserRole } from "@prisma/client";
import { hash } from "argon2";
import { db } from "~/server/db";

export async function userSeed() {
  const users = [
    {
      email: "admin@sep.com",
      password: await hash("12341234"),
      role: UserRole.ADMIN,
    },
    {
      email: "ep@sep.com",
      password: await hash("12341234"),
      role: UserRole.EventPlanner,
    },
    {
      email: "vo@sep.com",
      password: await hash("12341234"),
      role: UserRole.VenueOwner,
    },
    {
      email: "at@sep.com",
      password: await hash("12341234"),
      role: UserRole.Attendee,
    },
  ];

  await db.user.createMany({ data: users });
}
