import { z } from "zod";
import { VenueOwnerController } from "~/controller/VenueOwner";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const venueOwnerController = new VenueOwnerController();

export const VenueOwner = createTRPCRouter({
  searchVenue: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return await venueOwnerController.searchVenue(input);
  }),
  checkCapacity: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await venueOwnerController.searchVenue(input);
    }),
  discloseVenueDetail: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await venueOwnerController.discloseVenueDetail(input);
    }),
});
