import { db } from "~/server/db";
import FinishVenueOwnerRegistrationForm from "./finish-venue-owner-registration-form";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import FinishAttendeeRegistrationForm from "./finish-attendee-registration-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const getUser = async (userId: string) => {
  return await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Venue: true,
    },
  });
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  const user = await getUser(session.user.id);

  if (!user) {
    return redirect("/login");
  }
  return (
    <div className="container">
      {session.user.role === "VenueOwner" && (
        <FinishVenueOwnerRegistrationForm
          data={{
            username: user.name,
            phone: user.phone,
            address: user.address,
            ...user.Venue,
          }}
        />
      )}
      {session.user.role === "Attendee" && <FinishAttendeeRegistrationForm />}
    </div>
  );
}
