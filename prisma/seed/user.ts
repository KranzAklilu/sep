import { UserRole } from "@prisma/client";
import { hash } from "argon2";
import { db } from "~/server/db";

export async function userSeed() {
  const users = [
    {
      email: "admin@sep.com",
      password: await hash("12341234"),
      role: UserRole.ADMIN,
      approved: true,
    },
    {
      name: "Event planner",
      email: "ep@sep.com",
      password: await hash("12341234"),
      role: UserRole.EventPlanner,
      approved: true,
    },
    {
      name: "Venue owner",
      email: "vo@sep.com",
      password: await hash("12341234"),
      role: UserRole.VenueOwner,
      approved: true,
    },
    {
      name: "Attendee",
      email: "at@sep.com",
      password: await hash("12341234"),
      role: UserRole.Attendee,
      approved: true,
    },
  ];

  await db.user.createMany({ data: users });
}
