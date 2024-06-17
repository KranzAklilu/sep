import { db } from "~/server/db";
import VenueOwnerInquiries from "./table";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const getUsers = async () => {
  const ep = await db.user.findMany({
    where: {
      role: "EventPlanner",
      approved: null,
    },
  });
  const vo = await db.user.findMany({
    where: {
      role: "VenueOwner",
      approved: null,
    },
  });
  const ve = await db.user.findMany({
    where: {
      role: "Vendor",
      approved: null,
    },
  });

  return { ep, vo, ve };
};

export default async function AdminTables() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  const { ep, ve, vo } = await getUsers();

  return (
    <div className="container my-10">
      <Tabs defaultValue="ep">
        <TabsList>
          <TabsTrigger value="ep">Event planners</TabsTrigger>
          <TabsTrigger value="vo">Venue Owners</TabsTrigger>
          <TabsTrigger value="ve">Vendors</TabsTrigger>
        </TabsList>
        <TabsContent value="ep">
          <VenueOwnerInquiries users={ep} />
        </TabsContent>
        <TabsContent value="vo">
          <VenueOwnerInquiries users={vo} />
        </TabsContent>{" "}
        <TabsContent value="ve">
          <VenueOwnerInquiries users={ve} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
