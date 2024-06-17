"use client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { addDays, format, startOfWeek } from "date-fns";

export function VenueList() {
  const { data, isLoading } = api.venue.getList.useQuery();
  const router = useRouter();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? "...loading"
        : data?.map((venue) => (
            <Card
              onClick={() => router.push(`/venues/${venue.id}`)}
              className="col-span-1 w-full cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <CardHeader>
                <CardTitle>{venue.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Price per hour: ETB {venue.pricePerHour}
                </p>
                <p className="text-sm text-gray-400">
                  Capacity: {venue.capacity}
                </p>
                <p className="text-gray-600">Location: {venue.location}</p>
                <div>
                  {[0, 1, 2, 3, 4, 5, 6].map((day, index) => (
                    <div className="space-x-2" key={index}>
                      <Checkbox
                        id={`daysOfWeek[${index}]`}
                        checked={venue.availableDate.includes(index)}
                      />
                      <Label htmlFor={`daysOfWeek[${index}]`}>
                        {format(
                          addDays(startOfWeek(new Date()), index + 1),
                          "EEEEEEE",
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Open hour: {venue.openHour}
                </span>
                <span>-</span>
                <span className="text-sm text-gray-400">
                  Close hour: {venue.closeHour}
                </span>
              </CardFooter>
            </Card>
          ))}
    </div>
  );
}
