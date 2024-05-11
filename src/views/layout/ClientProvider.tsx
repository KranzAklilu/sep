"use client";
import { Toaster } from "~/components/ui/toaster";
export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
