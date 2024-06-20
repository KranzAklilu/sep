import { z } from "zod";
import { db } from "~/server/db";
import { userUpdateSchema } from "~/lib/validation/user";
import { User } from "@prisma/client";

export class VendorController {
  async provideShowcaseService(
    input: z.infer<typeof userUpdateSchema>,
    userId: string,
  ): Promise<User | null> {
    const validatedInput = userUpdateSchema.parse(input);
    const { name, address, phone, licenceDocument } = validatedInput;

    return await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        address,
        phone,
        licenceDocument,
      },
    });
  }
}
