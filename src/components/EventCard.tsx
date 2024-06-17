"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "~/components/ui/badge";
import { Event, Venue } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

const EventCard = ({
  event,
  remaining,
}: {
  event: Event & { Venue: Venue | null };
  remaining?: number;
}) => {
  return (
    <Link className="w-full" href={`/events/${event.id}`}>
      <Card className="h-full w-full cursor-pointer">
        <CardHeader>
          {event.featured && (
            <Badge className="mb-2 max-w-max" variant="secondary">
              Featured
            </Badge>
          )}
          <CardTitle>{event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">ETB {event.price}</p>
          {typeof remaining === "number" && (
            <p className="text-sm text-gray-400">{remaining} remaining</p>
          )}
          <p className="text-gray-600">{event.Venue?.location}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {format(event.date, "yyyy-MM-dd")}
          </span>
          <span className="text-sm text-gray-400">
            {event.startTime} - {event.endTime}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};
export default EventCard;
