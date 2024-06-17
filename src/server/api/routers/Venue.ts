import { z } from "zod";
import { venueCreateSchema, venueUpdateSchema } from "~/lib/validation/venue";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const Venue = createTRPCRouter({
  getList: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.venue.findMany();
  }),
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
  update: protectedProcedure
    .input(venueUpdateSchema)
    .mutation(async ({ ctx, input: { username, ...input } }) => {
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: username,
        },
      });
      return await ctx.db.venue.update({
        where: {
          ownerId: ctx.session.user.id,
        },
        data: {
          ...input,
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
