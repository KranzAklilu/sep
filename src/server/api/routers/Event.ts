import { z } from "zod";
import { EventController } from "~/controller/Event";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
const eventController = new EventController();

export const Event = createTRPCRouter({
  giveFeedback: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        comment: z.string(),
        rating: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await eventController.giveFeedback(input);
    }),
  arrangePaymentMethod: protectedProcedure.query(async () => {
    await eventController.arrangePaymentMethod();
  }),
  selectVenue: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await eventController.selectVenue(input);
    }),
  setSchedule: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await eventController.setSchedule(input);
    }),
  monitoryEvents: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await eventController.monitoryEvents(input);
    }),
  generateReports: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await eventController.generateReports(input);
    }),
  notify: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      await eventController.notify(input);
    }),
});
