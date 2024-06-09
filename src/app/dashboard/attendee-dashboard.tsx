import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { CalendarDateRangePicker } from "~/views/dashboard/date-range-picker";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import { format } from "date-fns";
import Link from "next/link";

const getEvents = async (userId: string) => {
  return await db.event.findMany({
    where: {
      EventAttendee: {
        some: {
          userId,
          approved: true,
        },
      },
    },
    include: {
      Venue: {
        select: {
          name: true,
          location: true,
        },
      },
    },
  });
};

export default async function AttendeeDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) return <>not logged in</>;

  const events = await getEvents(session.user.id);

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Registered Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{events.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      All time events attended
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{events.length}</div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-8">
                  <CardHeader className="flex flex-row justify-between">
                    <div>
                      <CardTitle>My Events</CardTitle>
                      <CardDescription>
                        You have around {events.length} active events
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {!events.length ? (
                        <div className="col-span-full flex w-full flex-col items-center justify-center py-20">
                          <p> No events registered yet</p>
                          <Link href="/events">
                            <Button>Browse events </Button>{" "}
                          </Link>
                        </div>
                      ) : (
                        events.map((event) => (
                          <Link key={event.id} href={`/events/${event.id}`}>
                            <Card className="col-span-1 w-full cursor-pointer transition-transform hover:scale-[1.02]">
                              <CardHeader>
                                <Badge
                                  className="mb-2 max-w-max"
                                  variant="secondary"
                                >
                                  Active
                                </Badge>
                                <CardTitle>{event.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-600">
                                  Price: ETB {event.price}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {event.attendeeLimit} remaining
                                </p>
                                <p className="text-gray-600">
                                  Location: {event.Venue?.location}
                                </p>
                                <p className="text-gray-600">
                                  Date: {format(event.date, "PPP")}
                                </p>
                              </CardContent>
                              <CardFooter className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">
                                  Start time: {event.startTime}
                                </span>
                                <span>-</span>
                                <span className="text-sm text-gray-400">
                                  End time: {event.endTime}
                                </span>
                              </CardFooter>
                            </Card>
                          </Link>
                        ))
                      )}
                    </div>
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
