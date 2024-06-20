import { ExternalLink, CheckIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

const getAttendees = async (userId: string) => {
  return await db.eventAttendee.findMany({
    where: {
      event: {
        ownerId: userId,
      },
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

export default async function RecentAttendees() {
  const session = await getServerSession(authOptions);

  if (!session) return <>not logged in</>;

  const attendees = await getAttendees(session.user.id);

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
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Attendee</CardTitle>
        <CardDescription>Displayed the last 100 attendees</CardDescription>
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
                      <input type="hidden" name="id" value={attendee.id} />
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
    </Card>
  );
}
