import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const Event = createTRPCRouter({
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
          eventId: input.eventId,
          comment: input.comment,
        },
      });
    }),
  arrangePaymentMethod: protectedProcedure.query(async ({ ctx }) => {
    console.log("payment method adjusted");
  }),
  selectVenue: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.venue.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
  setSchedule: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.venue.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
  monitoryEvents: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.venue.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
  generateReports: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const events = await ctx.db.event.findMany({
        where: {
          id: input.id,
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
    }),
  notify: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log("send email to the user");
    }),
});
