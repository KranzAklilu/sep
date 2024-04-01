import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { authOptions } from "~/server/auth";
import UserTable from "./UserTable";

export default async function Users() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "Admin") {
    return notFound();
  }
  return (
    <>
      <UserTable />
    </>
  );
}
