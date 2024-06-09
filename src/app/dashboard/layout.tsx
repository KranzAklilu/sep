import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { MainNav } from "~/views/dashboard/main-nav";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) return <>not logged in</>;

  return <div>{children}</div>;
}
