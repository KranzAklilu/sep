import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const VenueOwner = createTRPCRouter({
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
  discloseVenueDetail: protectedProcedure.mutation(async ({ ctx, input }) => {
    return await ctx.db.venue.findFirst({
      where: { id: input },
    });
  }),
});
