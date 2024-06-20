import { db } from "~/server/db";
import FinishVenueOwnerRegistrationForm from "./finish-venue-owner-registration-form";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import FinishAttendeeRegistrationForm from "./finish-attendee-registration-form";
import FinishEpRegistrationForm from "./finish-ep-registration-form";
import FinishVeRegistrationForm from "./finish-ve-registration-form";

const getVenue = async (userId: string) => {
  await db.venue.findUnique({
    where: {
      ownerId: userId,
    },
  });
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  return (
    <>
      {session.user.role === "VenueOwner" && (
        <FinishVenueOwnerRegistrationForm />
      )}
      {session.user.role === "Attendee" && <FinishAttendeeRegistrationForm />}
      {session.user.role === "EventPlanner" && <FinishEpRegistrationForm />}
      {session.user.role === "Vendor" && <FinishVeRegistrationForm />}
    </>
  );
}
