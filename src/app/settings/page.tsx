import { Search } from "lucide-react";
import { Metadata } from "next";
import Logo from "~/components/logo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { UserNav } from "~/components/user-nav";
import { MainNav } from "~/views/dashboard/main-nav";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import Feedback from "~/components/Feedback";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { db } from "~/server/db";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

const getSettings = async (userId: string) => {
  return await db.settings.findFirst({
    where: {
      userId,
    },
  });
};

export default async function DashboardPage({ params }: { params: any }) {
  const session = await getServerSession(authOptions);

  if (!session) return <>not logged in</>;

  const settings = await getSettings(session.user.id);

  async function create() {
    "use server";
  }
  async function updateSetting(formData: FormData) {
    "use server";
    if (!session || !session.user || !session.user.id) {
      return;
    }

    const data = {
      telebirrAccount: formData.get("telebirr")?.toString() || undefined,
      cbeAccount: formData.get("cbe")?.toString() || undefined,
      boaAccount: formData.get("boa")?.toString() || undefined,
    };
    console.log({ data });

    await db.settings.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        ...data,
      },
      create: {
        ...data,
        userId: session.user.id,
      },
    });
    toast({ title: "success" });
  }

  return (
    <div className="flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle> Payment</CardTitle>
          <CardDescription>choose suitable payment method</CardDescription>
        </CardHeader>

        <form action={updateSetting} className="max-w-lg space-y-6 px-8 py-8">
          <div className="">
            <Label htmlFor="telebirr">Your telebirr account phone number</Label>
            <Input
              id="telebirr"
              name="telebirr"
              defaultValue={settings?.telebirrAccount || ""}
            />
          </div>
          <div className="">
            <Label htmlFor="cbe">Your CBE account no.</Label>
            <Input
              id="cbe"
              name="cbe"
              defaultValue={settings?.cbeAccount || ""}
            />
          </div>
          <div className="">
            <Label htmlFor="boa">Your BOA account no.</Label>
            <Input
              id="boa"
              name="boa"
              defaultValue={settings?.boaAccount || ""}
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Feedback />
      </div>
    </div>
  );
}
