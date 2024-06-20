import { EventAttendee, Event } from "@prisma/client";
import { z } from "zod";
import { db } from "~/server/db";

const registerForAnEvent = z.object({
  eventId: z.string(),
  userId: z.string(),
  usedPaymentMethod: z.string(),
  paymentProof: z.string().url(),
});
const giveFeedbackInputSchema = z.object({
  eventId: z.string(),
  comment: z.string(),
  rating: z.number(),
});

export class AttendeeController {
  constructor() {}

  async exploreEvent(id: string): Promise<Event | null> {
    const validatedId = z.string().parse(id);

    return await db.event.findFirst({
      where: { id: validatedId },
    });
  }

  async registerForAnEvent(
    input: z.infer<typeof registerForAnEvent>,
  ): Promise<EventAttendee> {
    const validatedInput = registerForAnEvent.parse(input);

    const ev = await db.event.findUnique({
      where: { id: input.eventId },
    });
    if (!ev) {
      throw new Error("Event not found");
    }
    const ea = await db.eventAttendee.count({
      where: { eventId: input.eventId },
    });
    if (ev.attendeeLimit <= ea) {
      throw new Error("Attendee limit reached");
    }
    return await db.eventAttendee.create({
      data: {
        eventId: validatedInput.eventId,
        userId: validatedInput.userId,
        usedPayementMethod: validatedInput.usedPaymentMethod,
        paymentProof: validatedInput.paymentProof,
      },
    });
  }

  async giveFeedback(
    input: z.infer<typeof giveFeedbackInputSchema>,
    userId: string,
  ): Promise<void> {
    const validatedInput = giveFeedbackInputSchema.parse(input);
    const validatedUserId = z.string().parse(userId);

    await db.feedback.create({
      data: {
        rating: validatedInput.rating,
        attendeeId: validatedUserId,
        eventId: validatedInput.eventId,
        comment: validatedInput.comment,
      },
    });
  }
}
