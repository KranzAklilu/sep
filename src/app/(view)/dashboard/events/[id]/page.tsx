import { StarIcon } from "lucide-react";
import { Metadata } from "next";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "~/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import { notFound, redirect } from "next/navigation";
import Feedback from "~/components/Feedback";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { EditEventDialog } from "~/components/edit-event-dialog";

import { ExternalLink, CheckIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { PostponeDialog } from "~/components/postpone-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

const getEvent = async (id: string) => {
  return await db.event.findUnique({
    where: { id },
    include: {
      Feedback: {
        include: {
          Attendee: true,
        },
      },
      _count: {
        select: {
          EventAttendee: {
            where: {
              approved: true,
            },
          },
        },
      },
    },
  });
};

const getVenues = async () => {
  return await db.venue.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

const getAttendees = async (id: string) => {
  return await db.eventAttendee.findMany({
    where: {
      eventId: id,
    },
    orderBy: {
      approved: "asc",
    },
    include: {
      user: true,
      event: true,
    },
    take: 100,
  });
};

export default async function DashboardPage({ params }: { params: any }) {
  const session = await getServerSession(authOptions);

  if (!session) return <>not logged in</>;

  const event = await getEvent(params.id);
  if (!event) return notFound();

  const venues = await getVenues();

  const attendees = await getAttendees(params.id);

  async function changePrefferedPaymentMethod(formData: FormData) {
    "use server";
    const method = formData.get("method") as string;

    if (!method) return;

    await db.event.update({
      where: {
        id: event?.id,
      },
      data: {
        prefferedPaymentMethod: method,
      },
    });
  }

  async function markAsPaid(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;

    console.log(id);
    if (!id) return;

    await db.eventAttendee.update({
      where: {
        id,
      },
      data: {
        approved: true,
      },
    });
    redirect("/dashboard");
  }
  async function cancel(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;

    console.log(id);
    if (!id) return;

    await db.event.update({
      where: {
        id,
      },
      data: {
        canceled: true,
      },
    });
    redirect("/dashboard");
  }
  console.log({ event: JSON.stringify(event) });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{event.name}</h2>
          <div className="flex items-center space-x-2">
            <EditEventDialog event={event} venues={venues} />

            <PostponeDialog event={event} />
            <form action={cancel}>
              <input type="hidden" name="id" value={event.id} />
              <Button type="submit" variant="destructive">
                Cancel
              </Button>
            </form>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ETB{event.price * event._count.EventAttendee}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feedback</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5*</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {event._count.EventAttendee}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {attendees.map((attendee) => {
                  return (
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/05.png" alt="Avatar" />
                        <AvatarFallback>
                          {attendee.user.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium capitalize leading-none">
                          {attendee.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {attendee.event.name} (+ETB
                          {attendee.event.price})
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-4 font-medium">
                        <Link
                          href={attendee.paymentProof}
                          target="_blank"
                          className="flex text-sm"
                        >
                          <Button size="sm" variant="secondary">
                            See proof
                            <ExternalLink size={12} />
                          </Button>
                        </Link>
                        {!attendee.approved && (
                          <form action={markAsPaid}>
                            <input
                              type="hidden"
                              name="id"
                              value={attendee.id}
                            />
                            <Button type="submit" size="sm" variant="ghost">
                              Mark as paid
                              <CheckIcon size={12} />
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>{" "}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {event.Feedback.map((feedback) => {
                  return (
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/05.png" alt="Avatar" />
                        <AvatarFallback>
                          {feedback.Attendee?.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium capitalize leading-none">
                          {feedback.Attendee?.name}
                        </p>
                        <p className="flex text-sm text-muted-foreground">
                          {feedback.rating} <StarIcon className="h-4 w-4" />
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-4 font-medium">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="secondary">
                              Read comment
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Feedback from {feedback.Attendee?.name}
                              </DialogTitle>
                              <p>
                                {feedback.comment.split("\n").map((cmt) => (
                                  <>
                                    {cmt} <br />
                                  </>
                                ))}
                              </p>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle> Payment</CardTitle>
            <CardDescription>choose suitable payment method</CardDescription>
          </CardHeader>

          <form
            className="space-y-8 px-8 py-8"
            action={changePrefferedPaymentMethod}
          >
            <RadioGroup
              name="method"
              defaultValue={event.prefferedPaymentMethod}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="telebirr" id="r1" />
                <Label htmlFor="r1">telebirr</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cbe" id="r2" />
                <Label htmlFor="r2">CBE</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="boa" id="r3" />
                <Label htmlFor="r3">BOA</Label>
              </div>
            </RadioGroup>
            <Button type="submit">Save</Button>
          </form>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Feedback
            eventId={event.id}
            feedbackQuestions={event.feedbackQuestions}
          />
        </div>
      </div>
    </div>
  );
}
