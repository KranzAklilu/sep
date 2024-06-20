// router.ts

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { userUpdateSchema } from "~/lib/validation/user";
import { VendorController } from "~/controller/Vendor";

const userController = new VendorController();

export const Vendor = createTRPCRouter({
  providesShowcase: protectedProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await userController.provideShowcaseService(
        input,
        ctx.session?.user.id,
      );
    }),
});
