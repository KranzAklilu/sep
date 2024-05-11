import { z } from "zod";
import { venueCreateSchema } from "~/lib/validation/venue";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const Venue = createTRPCRouter({
  searchVenue: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.venue.findFirst({
        where: {
          name: {
            startsWith: input,
          },
        },
      });
    }),
  checkCapacity: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.venue.findFirst({
        where: { id: input },
        select: {
          capacity: true,
        },
      });
    }),
  create: protectedProcedure
    .input(venueCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.venue.create({
        data: {
          ...input,
          ownerId: ctx.session.user.id,
        },
      });
    }),
  accept: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.eventVenue.update({
        where: {
          id: input,
        },
        data: {
          accepted: true,
        },
      });
    }),
  reject: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.eventVenue.update({
        where: {
          id: input,
        },
        data: {
          rejected: true,
        },
      });
    }),
});
