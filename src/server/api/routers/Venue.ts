import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { venueCreateSchema, venueUpdateSchema } from "~/lib/validation/venue";
import { VenueController } from "~/controller/Venue";

const venueController = new VenueController();

export const Venue = createTRPCRouter({
  getList: protectedProcedure.query(async () => {
    return await venueController.getList();
  }),
  searchVenue: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return await venueController.searchVenue(input);
  }),
  checkCapacity: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await venueController.checkCapacity(input);
    }),
  create: protectedProcedure
    .input(venueCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return await venueController.create(input, ctx.session.user.id);
    }),
  update: protectedProcedure
    .input(venueUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await venueController.update(input, ctx.session.user.id);
    }),
  accept: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return await venueController.accept(input);
  }),
  reject: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return await venueController.reject(input);
  }),
});
