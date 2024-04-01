import { UserRole } from "@prisma/client";
import { hash } from "argon2";
import { db } from "~/server/db";

export async function userSeed() {
  const users = [
    {
      email: "test1@gmail.com",
      password: await hash("12341234"),
      role: UserRole.Admin,
    },
    {
      email: "test2@gmail.com",
      password: await hash("12341234"),
      role: UserRole.EventPlanner,
    },
    {
      email: "test2@gmail.com",
      password: await hash("12341234"),
      role: UserRole.VenueOwner,
    },
    {
      email: "test2@gmail.com",
      password: await hash("12341234"),
      role: UserRole.Attendee,
    },
  ];

  await db.user.createMany({ data: users });
}
