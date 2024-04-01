import { getServerSession } from "next-auth";
import { CreatePasswordForm } from "./create-password-form";
import { Session } from "next-auth";
import { authOptions } from "~/server/auth";
import { notFound } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return notFound();
  }
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome, {session?.user?.name}
          </h1>
          <p className="text-sm text-muted-foreground">Create your password</p>
        </div>
        <CreatePasswordForm user={session.user || {}} />
      </div>
    </div>
  );
};

export default page;
