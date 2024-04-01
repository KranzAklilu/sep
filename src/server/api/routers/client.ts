import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const clientRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const client = await ctx.db.client.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return client;
  }),
});
