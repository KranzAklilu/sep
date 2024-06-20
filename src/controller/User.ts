import { hash } from "argon2";
import { z } from "zod";
import { db } from "~/server/db";
import { userRegisterSchema, userUpdateSchema } from "~/lib/validation/user";
import { User } from "@prisma/client";

export class UserController {
  async getAll(): Promise<{ id: string; name: string | null }[]> {
    // Replace `any` with your User type
    return await db.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getVendors(): Promise<User[]> {
    return await db.user.findMany({
      where: {
        role: "Vendor",
      },
    });
  }

  async register(
    input: z.infer<typeof userRegisterSchema>,
  ): Promise<User | null> {
    const validatedInput = userRegisterSchema.parse(input);
    const { role, email, name, password } = validatedInput;
    return await db.user.create({
      data: {
        name,
        password: await hash(password),
        role,
        email,
      },
    });
  }

  async update(
    input: z.infer<typeof userUpdateSchema>,
    userId: string,
  ): Promise<User | null> {
    const validatedInput = userUpdateSchema.parse(input);
    const { name, address, phone, licenceDocument, telebirr, cbe, boa } =
      validatedInput;
    if (telebirr) {
      await db.settings.create({
        data: {
          userId: userId,
          telebirrAccount: telebirr,
          cbeAccount: cbe,
          boaAccount: boa,
        },
      });
    }
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
