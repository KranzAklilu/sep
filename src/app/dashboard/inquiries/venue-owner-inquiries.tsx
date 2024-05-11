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

export default function FinishVenueOwnerRegistrationForm({
  appliedEvents,
}: {
  appliedEvents: (Event & { phone: string })[];
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

  const { mutateAsync: reject } = api.venue.reject.useMutation({
    onSuccess: () => {
      toast({ title: "Event rejected!" });
    },
    onError: (err) => {
      toast({ title: "unexpected error has occured" });
      console.log(err);
    },
  });

  return (
    <div className="mx-auto max-w-4xl py-10">
      <h1 className="mb-10 text-2xl">Latest inquiries</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Event name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Expected no of attendee</TableHead>
            <TableHead className="text-right">Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
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
              <TableCell className="font-medium">{event.name}</TableCell>
              <TableCell>{event.attendeeLimit}</TableCell>
              <TableCell>{format(event.date, "yyyy-MM-dd")}</TableCell>
              <TableCell className="text-right">accept</TableCell>
              <TableCell className="text-right">reject</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
