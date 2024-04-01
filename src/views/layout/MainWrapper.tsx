import Link from "next/link";
import Nav from "./Nav";
import { UserNav } from "~/components/user-nav";
import { getServerSession } from "next-auth";
import ClientProvider from "./ClientProvider";
import { authOptions } from "~/server/auth";

export default async function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <>you need to get logged in</>;
  }
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <span className="">Phusion projects</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <Nav session={session} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
          <div className="flex-grow" />
          <form className="flex flex-initial items-center gap-4 sm:ml-auto sm:gap-2 lg:ml-auto lg:gap-4">
            <UserNav session={session} />
          </form>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <ClientProvider session={session}>{children}</ClientProvider>
        </main>
      </div>
    </div>
  );
}
