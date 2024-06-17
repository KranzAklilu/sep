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
import { Button } from "~/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import Link from "next/link";
import RegisterAttendeeDialog from "~/views/dashboard/RegisterAttendeeDialog";
import EventCard from "~/components/EventCard";
import EventMap from "./event-map";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import QRCode from "react-qr-code";

const getEvent = async function (id: string) {
  return await db.event.findFirst({
    where: {
      id,
    },
    include: {
      Venue: true,
      EventAttendee: {
        select: {
          userId: true,
          approved: true,
        },
      },
      Owner: {
        select: {
          Setting: true,
        },
      },
    },
  });
};

const getOtherEvents = async function (id: string) {
  return await db.event.findMany({
    where: {
      id: {
        not: id,
      },
    },
    take: 3,
    include: {
      Venue: true,
    },
  });
};

const EventDetailPage = async ({ params }: { params: any }) => {
  const session = await getServerSession(authOptions);

  // if (!session) return <>not logged in</>;

  const event = await getEvent(params.id as string);
  const otherEvents = await getOtherEvents(params.id as string);

  if (!event) {
    return notFound();
  }

  return (
    <div className="mt-10 space-y-10 px-28">
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
          <Link href={`/register`}>
            {!session?.user && <Button variant="outline">Get Involved</Button>}
          </Link>
          {session?.user.role === "EventPlanner" && (
            <Link href={`/dashboard/events/${event.id}`}>
              <Button variant="outline">Report</Button>
            </Link>
          )}

          {session?.user.role === "Attendee" &&
            (event.EventAttendee.find(
              ({ userId }) => userId === session.user.id,
            ) ? (
              event.EventAttendee.find(
                ({ userId, approved }) =>
                  userId === session.user.id && approved,
              ) ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Show QRcode</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Your unique qr code</DialogTitle>
                      <DialogDescription>
                        Scan this for approval
                      </DialogDescription>
                    </DialogHeader>
                    <QRCode
                      size={256}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      value={event.id + ";"}
                      viewBox={`0 0 256 256`}
                    />
                  </DialogContent>
                </Dialog>
              ) : (
                <Badge variant="secondary">Waiting for approval</Badge>
              )
            ) : (
              <RegisterAttendeeDialog
                userId={session.user.id}
                event={{
                  ...event,
                  telebirrAccount: event.Owner?.Setting?.telebirrAccount || "",
                  cbeAccount: event.Owner?.Setting?.cbeAccount || "",
                  boaAccount: event.Owner?.Setting?.boaAccount || "",
                }}
              />
            ))}
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

      {event.Venue?.lng && event.Venue?.lat && (
        <EventMap lng={event.Venue.lng} lat={event.Venue.lat} />
      )}
      <div>
        <h2>Other events</h2>
        <div className="mt-10 flex gap-6 overflow-x-scroll">
          {otherEvents.map((e) => (
            <EventCard event={e} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default EventDetailPage;
