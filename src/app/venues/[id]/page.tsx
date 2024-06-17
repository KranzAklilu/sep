import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { db } from "~/server/db";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import VenueCard from "~/components/VenuCard";
import EventMap from "./event-map";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { addDays, format, startOfWeek } from "date-fns";
import { CreateEventDialog } from "~/components/create-event-dialog";
import Link from "next/link";

const getVenue = async function (id: string) {
  return await db.venue.findFirst({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          Event: true,
        },
      },
    },
  });
};

const getOtherEvents = async function (id: string) {
  return await db.venue.findMany({
    where: {
      id: {
        not: id,
      },
    },
    take: 3,
  });
};

const getVenues = async () => {
  return await db.venue.findMany({
    select: { id: true, name: true, location: true },
  });
};
const EventDetailPage = async ({ params }: { params: any }) => {
  // if (!session) return <>not logged in</>;

  const venue = await getVenue(params.id as string);
  const venues = await getVenues();
  const otherVenues = await getOtherEvents(params.id as string);

  if (!venue) {
    return notFound();
  }

  return (
    <div className="mt-10 space-y-10 px-28">
      <Card className="mx-auto w-full shadow-none">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle className="text-3xl">{venue.name}</CardTitle>
          </div>
          <Link href={`?venue=${venue.id}`}>
            <CreateEventDialog venues={venues} />
          </Link>
        </CardHeader>
        <CardContent>
          <Badge className="mb-8">
            Price per hour ETB {venue.pricePerHour}
          </Badge>
          <h4>Descriptions</h4>
          <div className="text-gray-600">{venue.description}</div>

          <p className="text-gray-600">{venue.location}</p>
          {[0, 1, 2, 3, 4, 5, 6].map((_, index) => (
            <div className="space-x-2" key={index}>
              <Checkbox
                id={`daysOfWeek[${index}]`}
                checked={venue.availableDate.includes(index)}
              />
              <Label htmlFor={`daysOfWeek[${index}]`}>
                {format(addDays(startOfWeek(new Date()), index + 1), "EEEEEEE")}
              </Label>
            </div>
          ))}
        </CardContent>
        <CardFooter className="">
          <span className="text-sm text-gray-400">
            Open hour: {venue.openHour} - Close hour: {venue.closeHour}
          </span>
        </CardFooter>
      </Card>

      {venue.lng && venue.lat && <EventMap lng={venue.lng} lat={venue.lat} />}
      <div>
        <h2>Other venues</h2>
        <div className="mt-10 flex gap-6 overflow-x-scroll">
          {otherVenues.map((e) => (
            <VenueCard venue={e} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default EventDetailPage;
