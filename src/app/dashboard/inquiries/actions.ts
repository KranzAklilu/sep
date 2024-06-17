"use server";

import { db } from "~/server/db";

export const changeEvStatus = async (
  id: string,
  status: "Accept" | "Reject",
) => {
  return await db.eventVenue.update({
    where: {
      id,
    },
    data: {
      accepted: status === "Accept" || undefined,
      rejected: status === "Reject" || undefined,
    },
  });
};
