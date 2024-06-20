import { Venue } from "@prisma/client";
import { z } from "zod";
import { db } from "~/server/db";

export class VenueOwnerController {
  async searchVenue(input: string): Promise<Venue | null> {
    const validatedInput = z.string().parse(input);
    return await db.venue.findFirst({
      where: {
        name: {
          startsWith: validatedInput,
        },
      },
    });
  }

  async checkCapacity(input: string): Promise<{ capacity: number } | null> {
    const validatedInput = z.string().parse(input);
    return await db.venue.findFirst({
      where: { id: validatedInput },
      select: {
        capacity: true,
      },
    });
  }

  async discloseVenueDetail(input: string): Promise<Venue | null> {
    const validatedInput = z.string().parse(input);
    return await db.venue.findFirst({
      where: { id: validatedInput },
    });
  }
}
