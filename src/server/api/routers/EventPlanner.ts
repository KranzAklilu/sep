import { z } from "zod";
import {
  eventEditSchema,
  eventOrderSchema,
  eventPostponeSchema,
} from "~/lib/validation/event";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const EventPlanner = createTRPCRouter({
  getMany: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.event.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        Venue: true,
        EventVenue: true,
      },
    });
  }),
  getMy: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.event.findMany({
      where: { ownerId: ctx.session?.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        Venue: true,
        EventVenue: true,
      },
    });
  }),
  createEvent: protectedProcedure
    .input(eventOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const { venue, tag, ...data } = input;

      const ev = await ctx.db.event.create({
        data: {
          ...data,
          ownerId: ctx.session.user.id,
          venueId: venue,
        },
      });
      await ctx.db.eventVenue.create({
        data: {
          eventId: ev.id,
          venueId: venue,
        },
      });
      return ev;
    }),
  editEvent: protectedProcedure
    .input(eventEditSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { tag, id, ...data } = input;
      return await ctx.db.event.update({
        where: {
          id,
        },
        data: {
          ...data,
        },
      });
    }),
  createFeedbackQuestions: protectedProcedure
    .input(z.object({ id: z.string(), feedbackQuestions: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { id, feedbackQuestions } = input;
      return await ctx.db.event.update({
        where: {
          id,
        },
        data: {
          feedbackQuestions,
        },
      });
    }),
  postpone: protectedProcedure
    .input(eventPostponeSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.event.update({
        where: {
          id,
        },
        data: {
          ...data,
        },
      });
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
      return await ctx.db.event.findFirst({
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
