// router.ts

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { userRegisterSchema, userUpdateSchema } from "~/lib/validation/user";
import { UserController } from "~/controller/User";

const userController = new UserController();

export const Users = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    return await userController.getAll();
  }),
  getVendors: protectedProcedure.query(async () => {
    return await userController.getVendors();
  }),

  register: publicProcedure
    .input(userRegisterSchema)
    .mutation(async ({ input }) => {
      return await userController.register(input);
    }),

  update: protectedProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await userController.update(input, ctx.session?.user.id);
    }),
});
