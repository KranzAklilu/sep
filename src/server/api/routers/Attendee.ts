import { z } from "zod";
import { AttendeeController } from "~/controller/Attendee";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
const attendeeController = new AttendeeController();

export const Attendee = createTRPCRouter({
  exploreEvent: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const event = await attendeeController.exploreEvent(input);
      return event;
    }),
  registerForAnEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        userId: z.string(),
        usedPaymentMethod: z.string(),
        paymentProof: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const attendee = await attendeeController.registerForAnEvent(input);
      return attendee;
    }),
  giveFeedback: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        comment: z.string(),
        rating: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.feedback.create({
        data: {
          rating: input.rating,
          attendeeId: ctx.session.user.id,
          eventId: input.eventId,
          comment: input.comment,
        },
      });
    }),
});
