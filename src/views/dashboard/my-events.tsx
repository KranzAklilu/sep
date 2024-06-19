"use client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export function MyEvents() {
  const { data, isLoading } = api.event.getMy.useQuery();
  const router = useRouter();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? "...loading"
        : data?.map((event) => (
            <Card
              onClick={() => router.push(`/events/${event.id}`)}
              className="col-span-1 w-full cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <CardHeader>
                <Badge className="mb-2 max-w-max" variant="secondary">
                  {event.canceled
                    ? "Canceled"
                    : event.EventVenue.find((ev) => ev.eventId === event.id)
                          ?.accepted
                      ? event.date.getTime() < new Date().getTime()
                        ? "Passed"
                        : "Active"
                      : event.EventVenue.find((ev) => ev.eventId === event.id)
                            ?.rejected
                        ? "Rejected"
                        : "Waiting"}
                </Badge>
                <CardTitle>{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Price: ETB {event.price}</p>
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
          ))}
    </div>
  );
}
