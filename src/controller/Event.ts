import { Feedback, Venue } from "@prisma/client";
import { z } from "zod";
import { db } from "~/server/db";

const giveFeedbackSchema = z.object({
  eventId: z.string(),
  comment: z.string(),
  rating: z.number().min(1).max(5), // Assuming rating is between 1 and 5
});

const idSchema = z.string();

export class EventController {
  async giveFeedback(
    input: z.infer<typeof giveFeedbackSchema>,
  ): Promise<Feedback | null> {
    const validatedInput = giveFeedbackSchema.parse(input);
    const feedback = await db.feedback.create({
      data: {
        rating: validatedInput.rating,
        eventId: validatedInput.eventId,
        comment: validatedInput.comment,
      },
    });
    return feedback;
  }

  async arrangePaymentMethod(): Promise<void> {
    console.log("not used");
  }

  async selectVenue(input: { id: string }): Promise<Venue | null> {
    // Replace `any` with your Venue type
    const validatedInput = idSchema.parse(input.id);
    return await db.venue.findFirst({
      where: {
        id: validatedInput,
      },
    });
  }

  async setSchedule(input: { id: string }): Promise<Venue | null> {
    const validatedInput = idSchema.parse(input.id);
    return await db.venue.findFirst({
      where: {
        id: validatedInput,
      },
    });
  }

  async monitoryEvents(input: { id: string }): Promise<Venue | null> {
    const validatedInput = idSchema.parse(input.id);
    return await db.venue.findFirst({
      where: {
        id: validatedInput,
      },
    });
  }

  async generateReports(input: {
    id: string;
  }): Promise<{ sales: number; users: number; feedback: number }> {
    const validatedInput = idSchema.parse(input.id);
    const events = await db.event.findMany({
      where: {
        id: validatedInput,
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
    const validatedInput = idSchema.parse(input.id);
    console.log("send email to the user");
  }
}
