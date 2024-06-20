import { z } from "zod";
import { EventPlannerController } from "~/controller/EventPlanner";
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

const eventPlannerController = new EventPlannerController();

export const EventPlanner = createTRPCRouter({
  getMany: publicProcedure.query(async () => {
    return await eventPlannerController.getMany();
  }),
  getMy: publicProcedure.query(async ({ ctx }) => {
    return await eventPlannerController.getMy(ctx.session?.user.id || "");
  }),
  createEvent: protectedProcedure
    .input(eventOrderSchema)
    .mutation(async ({ ctx, input }) => {
      return await eventPlannerController.createEvent(
        input,
        ctx.session.user.id,
      );
    }),
  editEvent: protectedProcedure
    .input(eventEditSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await eventPlannerController.editEvent(input);
    }),
  createFeedbackQuestions: protectedProcedure
    .input(z.object({ id: z.string(), feedbackQuestions: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      return await eventPlannerController.createFeedbackQuestions(input);
    }),
  postpone: protectedProcedure
    .input(eventPostponeSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await eventPlannerController.postpone(input);
    }),
  selectVenue: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await eventPlannerController.selectVenue(input);
    }),
  setSchedule: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await eventPlannerController.setSchedule(input);
    }),
  monitoryEvents: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await eventPlannerController.monitoryEvents(input);
    }),
  generateReports: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await eventPlannerController.generateReports(input);
    }),
  notify: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await eventPlannerController.notify(input);
    }),
});
