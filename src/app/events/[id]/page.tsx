import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { format } from "date-fns";
import { db } from "~/server/db";
import { notFound } from "next/navigation";
import Navbar from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import Link from "next/link";
import RegisterAttendeeDialog from "./RegisterAttendeeDialog";

const getEvent = async function (id: string) {
  return await db.event.findFirst({
    where: {
      id,
    },
    include: {
      Venue: true,
      Owner: {
        select: {
          Setting: true,
        },
      },
    },
  });
};

const EventDetailPage = async ({ params }: { params: any }) => {
  const session = await getServerSession(authOptions);

  if (!session) return <>not logged in</>;

  const event = await getEvent(params.id as string);

  if (!event) {
    return notFound();
  }

  return (
    <>
      <Navbar />
      <div className="mt-10 px-28">
        <Card className="mx-auto w-full shadow-none">
          <CardHeader className="flex flex-row justify-between">
            <div>
              {event.featured && (
                <Badge className="mb-2 max-w-max" variant="secondary">
                  Featured
                </Badge>
              )}

              <CardTitle className="text-3xl">{event.name}</CardTitle>
            </div>
            {session.user.role === "EventPlanner" && (
              <Link href={`/dashboard/events/${event.id}`}>
                <Button variant="outline">Report</Button>
              </Link>
            )}
            {session.user.role === "VenueOwner" && (
              <Button className="w-auto" variant="outline">
                Register
              </Button>
            )}
            {session.user.role === "Attendee" && (
              <RegisterAttendeeDialog
                userId={session.user.id}
                event={{
                  ...event,
                  telebirrAccount: event.Owner?.Setting?.telebirrAccount || "",
                  cbeAccount: event.Owner?.Setting?.cbeAccount || "",
                  boaAccount: event.Owner?.Setting?.boaAccount || "",
                }}
              />
            )}
          </CardHeader>
          <CardContent>
            <Badge className="mb-8">ETB {event.price}</Badge>
            <h4>Descriptions</h4>
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: event.description }}
            ></div>

            <p className="text-gray-600">{event.Venue?.location}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Date: {format(event.date, "yyyy-MM-dd")}
            </span>
            <span className="text-sm text-gray-400">
              Start time: {event.startTime} - End time: {event.endTime}
            </span>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
export default EventDetailPage;
