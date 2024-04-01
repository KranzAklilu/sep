import { db } from "~/server/db";
import { faker } from "@faker-js/faker";

export async function eventSeed() {
  const document = await db.event.create();
}
