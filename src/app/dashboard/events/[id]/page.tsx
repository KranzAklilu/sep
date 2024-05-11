import { Search } from "lucide-react";
import { Metadata } from "next";
import Logo from "~/components/logo";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "~/components/ui/card";
import { UserNav } from "~/components/user-nav";
import { MainNav } from "~/views/dashboard/main-nav";
import { RecentSales } from "~/views/dashboard/recent-sales";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import { notFound } from "next/navigation";
import Feedback from "~/components/Feedback";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { EditEventDialog } from "~/components/edit-event-dialog";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

const getEvent = async (id: string) => {
  return await db.event.findUnique({
    where: { id },
  });
};

const getVenues = async () => {
  return await db.venue.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};
export default async function DashboardPage({ params }: { params: any }) {
  const session = await getServerSession(authOptions);

  if (!session) return <>not logged in</>;

  const event = await getEvent(params.id);
  if (!event) return notFound();

  const venues = await getVenues();
  console.log({ venues });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{event.name}</h2>
          <div className="flex items-center space-x-2">
            <EditEventDialog event={event} venues={venues} />
            <Button variant="outline">Postpone</Button>
            <Button variant="destructive">Cancel</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
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
                <CardTitle className="text-sm font-medium">Feedback</CardTitle>
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
                <div className="text-2xl font-bold">5*</div>
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
                <div className="text-2xl font-bold">+150</div>
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
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Registered Attendee</CardTitle>
              <CardDescription>20 attendees registered</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle> Payment</CardTitle>
            <CardDescription>choose suitable payment method</CardDescription>
          </CardHeader>

          <div className="px-8 py-8">
            <RadioGroup defaultValue="comfortable">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="telebirr" id="r1" />
                <Label htmlFor="r1">telebirr</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cbe" id="r2" />
                <Label htmlFor="r2">CBE</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="boa" id="r3" />
                <Label htmlFor="r3">BOA</Label>
              </div>
            </RadioGroup>
          </div>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Feedback />
        </div>
      </div>
    </div>
  );
}
