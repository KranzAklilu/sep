import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const Attendee = createTRPCRouter({
  exploreEvent: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.event.findFirst({
        where: { id: input },
      });
    }),
  registerForAnEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          id: input.userId,
        },
      });
      if (user) {
        throw new TRPCError({
          message: "User already exists",
          code: "BAD_REQUEST",
        });
      }

      return await ctx.db.eventUser.create({
        data: {
          eventId: input.eventId,
          userId: input.userId,
        },
      });
    }),
  giveFeedback: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        comment: z.string(),
        rating: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.feedback.create({
        data: {
          rating: input.rating,
          eventId: input.eventId,
          comment: input.comment,
        },
      });
    }),
});
