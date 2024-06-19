import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { MyEvents } from "~/views/dashboard/my-events";
import { CreateEventDialog } from "~/components/create-event-dialog";
import { db } from "~/server/db";
import RecentAttendees from "./recent_attendees";

const getVenues = async () => {
  return await db.venue.findMany({
    select: { id: true, name: true, location: true },
  });
};

const dashboardd = async (ownerId: string) => {
  const totaleventcount = await db.event.count({
    where: {
      ownerId,
    },
  });

  const events = await db.event.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      ownerId,
    },
    include: {
      Venue: true,
      EventVenue: true,
      EventAttendee: true,
    },
  });

  return {
    totalRevenue: events.reduce(
      (prev, curr) => (prev + curr.price) * curr.EventAttendee.length,
      0,
    ),
    totaleventcount,
    activeCount: events.reduce(
      (prev, curr) =>
        prev + (curr.EventVenue.find((ev) => ev.accepted) ? 1 : 0),
      0,
    ),
    totalSalesCount: events.reduce(
      (prev, curr) => prev + curr.EventAttendee.length,
      0,
    ),
  };
};

export default async function EventPlannerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) return <>not logged in</>;

  const venues = await getVenues();
  const transaction = await dashboardd(session.user.id);

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Active Revenue
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ETB {transaction.totalRevenue}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Events organized
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {transaction.totaleventcount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {transaction.totalSalesCount}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Events now
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {transaction.activeCount}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RecentAttendees />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-8">
                  <CardHeader className="flex flex-row justify-between">
                    <div>
                      <CardTitle>My Events</CardTitle>
                    </div>
                    <span>
                      <CreateEventDialog venues={venues} />
                    </span>
                  </CardHeader>
                  <CardContent className="">
                    <MyEvents />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
