import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const createUserSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
});

export const userRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }),
  create: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (user) {
        throw new TRPCError({
          message: "User already exists",
          code: "BAD_REQUEST",
        });
      }

      return await ctx.db.user.create({
        data: {
          ...input,
        },
      });
    }),
  createPassword: protectedProcedure
    .input(z.object({ name: z.string().optional(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log(ctx.session);
      const updatedUser = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          password: await hash(input.password),
        },
      });
      return updatedUser;
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.delete({
        where: { id: input },
      });
    }),
});
