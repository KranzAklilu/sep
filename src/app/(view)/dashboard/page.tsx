import { Metadata } from "next";
import EventPlannerDashboard from "./event-planner-dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { UserRole } from "@prisma/client";
import AttendeeDashboard from "./attendee-dashboard";
import { redirect } from "next/navigation";
import AdminTables from "../_admin_tables";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) return <>not logged in</>;

  if (session?.user.role === UserRole.VenueOwner) {
    return redirect("/dashboard/inquiries");
  }
  return (
    <>
      {session.user.role === UserRole["EventPlanner"] && (
        <EventPlannerDashboard />
      )}
      {session.user.role === UserRole["Attendee"] && <AttendeeDashboard />}
      {session.user.role === UserRole["ADMIN"] && <AdminTables />}
    </>
  );
}
