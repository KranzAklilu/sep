"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "~/components/ui/toaster";
export default async function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster />
    </SessionProvider>
  );
}
