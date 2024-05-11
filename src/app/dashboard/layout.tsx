import { Metadata } from "next";
import EventPlannerDashboard from "./event-planner-dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { UserRole } from "@prisma/client";
import AttendeeDashboard from "./attendee-dashboard";
import { UserNav } from "~/components/user-nav";
import { MainNav } from "~/views/dashboard/main-nav";
import Logo from "~/components/logo";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) return <>not logged in</>;

  return (
    <div>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Logo />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav session={session} />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
