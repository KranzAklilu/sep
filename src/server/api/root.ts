import { createTRPCRouter } from "~/server/api/trpc";
import { EventPlanner } from "./routers/EventPlanner";
import { Event } from "./routers/Event";
import { Attendee } from "./routers/Attendee";
import { Users } from "./routers/Users";
import { VenueOwner } from "./routers/VenueOwner";
import { Venue } from "./routers/Venue";
import { Vendor } from "./routers/Vendor";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  event: EventPlanner,
  user: Users,
  attendee: Attendee,
  event1: Event,
  venueOwner: VenueOwner,
  venue: Venue,
  vendor: Vendor,
});

// export type definition of API
export type AppRouter = typeof appRouter;
