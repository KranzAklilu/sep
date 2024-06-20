import { z } from "zod";
import { db } from "~/server/db";
import {
  eventEditSchema,
  eventOrderSchema,
  eventPostponeSchema,
} from "~/lib/validation/event";
import { Event, Venue } from "@prisma/client";

export class EventPlannerController {
  async getMany(): Promise<any> {
    // Replace `any` with your Event type
    return await db.event.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        date: {
          gt: new Date(),
        },
        EventVenue: {
          some: {
            accepted: true,
          },
        },
      },
      include: {
        Venue: true,
        EventVenue: true,
      },
    });
  }

  async getMy(userId: string): Promise<Event[]> {
    // Replace `any` with your Event type
    return await db.event.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        Venue: true,
        EventVenue: true,
      },
    });
  }

  async createEvent(
    input: z.infer<typeof eventOrderSchema>,
    userId: string,
  ): Promise<Event | null> {
    const validatedInput = eventOrderSchema.parse(input);
    const { venue, tag, ...data } = validatedInput;

    const ev = await db.event.create({
      data: {
        ...data,
        ownerId: userId,
        description: data.description || "",
        venueId: venue,
      },
    });
    await db.eventVenue.create({
      data: {
        eventId: ev.id,
        venueId: venue,
      },
    });
    return ev;
  }

  async editEvent(
    input: z.infer<typeof eventEditSchema & { id: string }>,
  ): Promise<Event | null> {
    const validatedInput = eventEditSchema
      .extend({ id: z.string() })
      .parse(input);
    const { tag, id, ...data } = validatedInput;
    return await db.event.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async createFeedbackQuestions(input: {
    id: string;
    feedbackQuestions: string[];
  }): Promise<Event | null> {
    const validatedInput = z
      .object({ id: z.string(), feedbackQuestions: z.array(z.string()) })
      .parse(input);
    const { id, feedbackQuestions } = validatedInput;
    return await db.event.update({
      where: {
        id,
      },
      data: {
        feedbackQuestions,
      },
    });
  }

  async postpone(
    input: z.infer<typeof eventPostponeSchema & { id: string }>,
  ): Promise<Event | null> {
    const validatedInput = eventPostponeSchema
      .extend({ id: z.string() })
      .parse(input);
    const { id, ...data } = validatedInput;
    return await db.event.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async selectVenue(input: { id: string }): Promise<Venue | null> {
    const validatedInput = z.object({ id: z.string() }).parse(input);
    return await db.venue.findFirst({
      where: {
        id: validatedInput.id,
      },
    });
  }

  async setSchedule(input: { id: string }): Promise<Venue | null> {
    // Replace `any` with your Venue type
    const validatedInput = z.object({ id: z.string() }).parse(input);
    return await db.venue.findFirst({
      where: {
        id: validatedInput.id,
      },
    });
  }

  async monitoryEvents(input: { id: string }): Promise<Event | null> {
    const validatedInput = z.object({ id: z.string() }).parse(input);
    return await db.event.findFirst({
      where: {
        id: validatedInput.id,
      },
    });
  }

  async generateReports(input: {
    id: string;
  }): Promise<{ sales: number; users: number; feedback: number }> {
    const validatedInput = z.object({ id: z.string() }).parse(input);
    const events = await db.event.findMany({
      where: {
        id: validatedInput.id,
      },
    });

    let report = {
      sales: 0,
      users: 0,
      feedback: 0,
    };
    for (let i = 0; i < events.length; i++) {
      report.sales++;
    }
    return report;
  }

  async notify(input: { id: string }): Promise<void> {
    const validatedInput = z.object({ id: z.string() }).parse(input);
    console.log("send email to the user");
  }
}
