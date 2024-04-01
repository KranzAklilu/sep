import { orderRouter } from "~/server/api/routers/order";
import { createTRPCRouter } from "~/server/api/trpc";
import { documentRouter } from "./routers/document";
import { clientRouter } from "./routers/client";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  order: orderRouter,
  document: documentRouter,
  user: userRouter,
  clientRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
