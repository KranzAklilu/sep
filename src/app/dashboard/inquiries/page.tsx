import { db } from "~/server/db";
import VenueOwnerInquiries from "./venue-owner-inquiries";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const appliedEvents = async (userId: string) => {
  return await db.eventVenue.findMany({
    where: {
      venue: {
        ownerId: userId,
      },
    },
    include: {
      event: {
        include: {
          Owner: {
            select: {
              phone: true,
            },
          },
        },
      },
    },
  });
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  const ev = await appliedEvents(session.user.id);

  return (
    <div className="container my-10">
      <Tabs defaultValue="requested">
        <TabsList>
          <TabsTrigger value="requested">Requested</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="requested">
          <VenueOwnerInquiries
            req={true}
            appliedEvents={ev
              .filter((e) => !e.accepted && !e.rejected)
              .map((e) => ({
                ...e.event,
                evId: e.id,
                phone: e.event.Owner?.phone || "",
              }))}
          />
        </TabsContent>
        <TabsContent value="accepted">
          <VenueOwnerInquiries
            appliedEvents={ev
              .filter((e) => e.accepted)
              .map((e) => ({
                ...e.event,
                evId: e.id,
                accepted: e.accepted,
                rejected: e.rejected,
                phone: e.event.Owner?.phone || "",
              }))}
          />
        </TabsContent>{" "}
        <TabsContent value="rejected">
          <VenueOwnerInquiries
            appliedEvents={ev
              .filter((e) => e.rejected)
              .map((e) => ({
                ...e.event,
                evId: e.id,
                phone: e.event.Owner?.phone || "",
              }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
