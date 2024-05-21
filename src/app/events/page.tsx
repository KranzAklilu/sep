import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { MyEvents } from "~/views/dashboard/my-events";
import { db } from "~/server/db";
import Navbar from "~/components/navbar";
import { Input } from "~/components/ui/input";

const getVenues = async () => {
  return await db.venue.findMany({
    select: { id: true, name: true },
  });
};

export default async function EventPlannerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) return <>not logged in</>;

  return (
    <>
      <Navbar />
      <div className="grid gap-4 p-10 md:grid-cols-2 lg:grid-cols-7">
        <Input
          placeholder="Search..."
          className="lg:col-span-3 lg:col-start-3"
        />
        <div className="col-span-8 px-10">
          <h3 className="text-xl">All events</h3>
          <MyEvents />
        </div>
      </div>
    </>
  );
}
