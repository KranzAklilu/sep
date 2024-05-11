import { db } from "~/server/db";
import VenueOwnerInquiries from "./venue-owner-inquiries";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";

const appliedEvents = async (userId: string) => {
  return await db.eventVenue.findMany({
    where: {
      venue: {
        ownerId: userId,
      },
      accepted: false,
      rejected: false,
    },
    include: {
      event: {
        include: {
          Owner: {
            select: {
              phone: true,
            },
          },
        },
      },
    },
  });
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  const ev = await appliedEvents(session.user.id);

  return (
    <div>
      {session.user.role === "VenueOwner" && (
        <VenueOwnerInquiries
          appliedEvents={ev.map((e) => ({
            ...e.event,
            phone: e.event.Owner?.phone || "",
          }))}
        />
      )}
    </div>
  );
}
