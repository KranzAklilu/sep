"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Venue } from "@prisma/client";
import Link from "next/link";

const VenueCard = ({ venue }: { venue: Venue }) => {
  return (
    <Link className="w-full" href={`/venues/${venue.id}`}>
      <Card className="h-full w-full cursor-pointer">
        <CardHeader>
          <CardTitle>{venue.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">ETB {venue.pricePerHour}</p>
          <p className="text-gray-600">{venue.location}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {venue.openHour} - {venue.closeHour}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};
export default VenueCard;
