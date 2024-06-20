import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { MyEvents } from "~/components/my-events-list";
import { db } from "~/server/db";
import { Input } from "~/components/ui/input";

export default async function EventPlannerDashboard() {
  const session = await getServerSession(authOptions);

  // if (!session) return <>not logged in</>;

  return (
    <>
      <div className="grid gap-4 p-10 md:grid-cols-2 lg:grid-cols-7">
        <MyEvents />
      </div>
    </>
  );
}
