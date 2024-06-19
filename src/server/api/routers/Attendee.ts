import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const Attendee = createTRPCRouter({
  exploreEvent: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.event.findFirst({
        where: { id: input },
      });
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
      const ev = await ctx.db.event.findUnique({
        where: {
          id: input.eventId,
        },
      });
      if (!ev) {
        throw new Error("no event");
      }
      const ea = await ctx.db.eventAttendee.count({
        where: {
          eventId: input.eventId,
        },
      });
      if (ev?.attendeeLimit <= ea) {
        throw new Error("Attendee limmit reached. Good luck nextime");
      }
      return await ctx.db.eventAttendee.create({
        data: {
          eventId: input.eventId,
          userId: input.userId,
          usedPayementMethod: input.usedPaymentMethod,
          paymentProof: input.paymentProof,
        },
      });
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
