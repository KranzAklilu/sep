import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "~/components/ui/card";
import { CalendarDateRangePicker } from "~/views/dashboard/date-range-picker";
import { Overview } from "~/views/dashboard/overview";
import { RecentSales } from "~/views/dashboard/recent-sales";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { MyEvents } from "~/views/dashboard/my-events";
import { CreateEventDialog } from "~/components/create-event-dialog";
import { db } from "~/server/db";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CheckIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const getVenues = async () => {
  return await db.venue.findMany({
    select: { id: true, name: true },
  });
};

const getAttendees = async (userId: string) => {
  return await db.eventAttendee.findMany({
    where: {
      event: {
        ownerId: userId,
      },
    },
    orderBy: {
      approved: "asc",
    },
    include: {
      user: true,
      event: true,
    },
    take: 100,
  });
};

export default async function EventPlannerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) return <>not logged in</>;

  const venues = await getVenues();
  const attendees = await getAttendees(session.user.id);

  async function markAsPaid(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;

    console.log(id);
    if (!id) return;

    await db.eventAttendee.update({
      where: {
        id,
      },
      data: {
        approved: true,
      },
    });
    redirect("/dashboard");
  }

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Filter</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {/* <TabsTrigger value="events" disabled>
                Events
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
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
                    <div className="text-2xl font-bold">ETB45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
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
                    <div className="text-2xl font-bold">+120</div>
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
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
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
                    <div className="text-2xl font-bold">2</div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Attendee</CardTitle>
                    <CardDescription>
                      Displayed the last 100 attendees
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {attendees.map((attendee) => {
                        return (
                          <div className="flex items-center">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src="/avatars/05.png" alt="Avatar" />
                              <AvatarFallback>
                                {attendee.user.name?.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium capitalize leading-none">
                                {attendee.user.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {attendee.event.name} (+ETB
                                {attendee.event.price})
                              </p>
                            </div>
                            <div className="ml-auto flex items-center gap-4 font-medium">
                              <Link
                                href={attendee.paymentProof}
                                target="_blank"
                                className="flex text-sm"
                              >
                                <Button size="sm" variant="secondary">
                                  See proof
                                  <ExternalLink size={12} />
                                </Button>
                              </Link>
                              {!attendee.approved && (
                                <form action={markAsPaid}>
                                  <input
                                    type="hidden"
                                    name="id"
                                    value={attendee.id}
                                  />
                                  <Button
                                    type="submit"
                                    size="sm"
                                    variant="ghost"
                                  >
                                    Mark as paid
                                    <CheckIcon size={12} />
                                  </Button>
                                </form>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-8">
                  <CardHeader className="flex flex-row justify-between">
                    <div>
                      <CardTitle>My Events</CardTitle>
                      <CardDescription>
                        You have around 5 active events
                      </CardDescription>
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
