"use server";

import { db } from "~/server/db";

export const approveUser = async (id: string, status: "Accept" | "Reject") => {
  return await db.user.update({
    where: {
      id,
    },
    data: {
      approved: status === "Accept",
    },
  });
};
