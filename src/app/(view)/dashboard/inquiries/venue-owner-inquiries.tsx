"use client";

import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { venueCreateSchema as schema } from "~/lib/validation/venue";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Event } from "@prisma/client";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import { changeEvStatus } from "./actions";
import Link from "next/link";

export default function FinishVenueOwnerRegistrationForm({
  appliedEvents,
  req = false,
}: {
  appliedEvents: (Event & {
    phone: string;
    evId: string;
  })[];
  req?: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const { mutateAsync: accpet } = api.venue.accept.useMutation({
    onSuccess: () => {
      toast({ title: "Event accepted!" });
    },
    onError: (err) => {
      toast({ title: "unexpected error has occured" });
      console.log(err);
    },
  });
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Event name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Expected no of attendee</TableHead>
            <TableHead>Date</TableHead>
            {req && (
              <>
                <TableHead className="text-right">Accept</TableHead>
                <TableHead className="text-right">Reject</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!appliedEvents.length && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No result
              </TableCell>
            </TableRow>
          )}
          {appliedEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">
                <Link href={`/events/${event.id}`}>{event.name}</Link>
              </TableCell>
              <TableCell>{event.phone}</TableCell>
              <TableCell>{event.attendeeLimit}</TableCell>
              <TableCell>{format(event.date, "yyyy-MM-dd")}</TableCell>
              {req && (
                <>
                  <TableCell className="text-right">
                    <Button
                      onClick={async () => {
                        await changeEvStatus(event.evId, "Accept");
                        router.refresh();
                        toast({ title: "Thanks for accepting" });
                      }}
                      variant="ghost"
                    >
                      Accept
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={async () => {
                        await changeEvStatus(event.evId, "Reject");
                        router.refresh();
                        toast({ title: "Rejected!" });
                      }}
                      variant="ghost"
                    >
                      Reject
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
