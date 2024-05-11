import { db } from "~/server/db";
import { faker } from "@faker-js/faker";

export async function venueSeed() {
  const venue = await db.venue.create({
    data: {
      id: "venue-1",
      name: "Gihon hotel",
      location: "Addis Ababa",
      capacity: 2,
    },
  });
}
