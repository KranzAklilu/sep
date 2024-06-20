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
import { Event, User, Venue } from "@prisma/client";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import { approveUser } from "./actions";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

export default function AdminDashboardTable({
  users: usr,
}: {
  users: (User & { Venue?: Venue | null })[];
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
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Phone</TableHead>
            {!usr[0]?.Venue && <TableHead>Document</TableHead>}
            <TableHead>Requested at</TableHead>
            <TableHead className="text-right">Accept</TableHead>
            <TableHead className="text-right">Reject</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!usr.length && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No result
              </TableCell>
            </TableRow>
          )}
          {usr.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <Link
                  href={
                    user.Venue
                      ? `/venues/${user.Venue.id}`
                      : `/events/${user.id}`
                  }
                >
                  {user.Venue ? user.Venue.name : user.name}
                </Link>
              </TableCell>
              <TableCell>{user.phone}</TableCell>
              {!usr[0]?.Venue && (
                <TableCell>
                  <Link target="_blank" href={user.licenceDocument || ""}>
                    Document
                  </Link>
                </TableCell>
              )}
              <TableCell>{format(user.createdAt, "yyyy-MM-dd")}</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost">Accept</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogClose>
                      <Button
                        onClick={async () => {
                          await approveUser(user.id, "Accept");
                          router.refresh();
                          toast({ title: "Thanks for accepting" });
                        }}
                      >
                        Continue
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost">Reject</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogClose>
                      <Button
                        onClick={async () => {
                          await approveUser(user.id, "Reject");
                          router.refresh();
                          toast({ title: "Rejected!" });
                        }}
                      >
                        Continue
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
