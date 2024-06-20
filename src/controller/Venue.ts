import { z } from "zod";
import { db } from "~/server/db";
import { venueCreateSchema, venueUpdateSchema } from "~/lib/validation/venue";
import { EventVenue, Venue } from "@prisma/client";

export class VenueController {
  async getList(): Promise<any> {
    return await db.venue.findMany();
  }

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

  async create(
    input: z.infer<typeof venueCreateSchema>,
    userId: string,
  ): Promise<Venue | null> {
    const validatedInput = venueCreateSchema.parse(input);
    return await db.venue.create({
      data: {
        ...validatedInput,
        ownerId: userId,
      },
    });
  }

  async update(
    input: z.infer<typeof venueUpdateSchema>,
    userId: string,
  ): Promise<Venue | null> {
    const { username, ...validatedInput } = venueUpdateSchema.parse(input);
    await db.user.update({
      where: { id: userId },
      data: {
        name: username,
      },
    });
    return await db.venue.update({
      where: {
        ownerId: userId,
      },
      data: {
        ...validatedInput,
      },
    });
  }

  async accept(input: string): Promise<EventVenue | null> {
    const validatedInput = z.string().parse(input);
    return await db.eventVenue.update({
      where: {
        id: validatedInput,
      },
      data: {
        accepted: true,
      },
    });
  }

  async reject(input: string): Promise<EventVenue | null> {
    const validatedInput = z.string().parse(input);
    return await db.eventVenue.update({
      where: {
        id: validatedInput,
      },
      data: {
        rejected: true,
      },
    });
  }
}
