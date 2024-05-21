import { hash } from "argon2";
import { userRegisterSchema, userUpdateSchema } from "~/lib/validation/user";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const Users = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const client = await ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return client;
  }),

  register: publicProcedure
    .input(userRegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const { role, email, name, password } = input;
      return await ctx.db.user.create({
        data: {
          name,
          password: await hash(password),
          role,
          email,
        },
      });
    }),

  update: publicProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, address, phone } = input;
      console.log(ctx.session);
      return await ctx.db.user.update({
        where: {
          id: ctx.session?.user.id,
        },
        data: {
          name,
          address,
          phone,
        },
      });
    }),
});
