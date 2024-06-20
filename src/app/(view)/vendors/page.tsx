import { db } from "~/server/db";
import VenueOwnerInquiries from "./table";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const getUsers = async () => {
  const ve = await db.user.findMany({
    where: {
      role: "Vendor",
      approved: true,
    },
  });

  return ve;
};

export default async function AdminTables() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  const ve = await getUsers();

  return (
    <div className="container my-10">
      <Tabs defaultValue="ve">
        <TabsList>
          <TabsTrigger value="ve">Vendors</TabsTrigger>
        </TabsList>
        <TabsContent value="ve">
          <VenueOwnerInquiries users={ve} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
