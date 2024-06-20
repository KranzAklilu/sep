import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import ClientProvider from "~/components/layout/ClientProvider";
import Navbar from "~/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { MainNav } from "~/components/main-nav";
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Redirection from "./redirection";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Smart Event planner",
  description: "getting habeshas together",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const pathname = headers().get("next-url") as string;

  const dbUser = await db.user.findFirst({
    where: { id: session?.user.id },
    include: {
      Setting: true,
      Venue: true,
    },
  });

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>
          <ClientProvider>
            <Redirection dbUser={dbUser} />
            {!session?.user ? <Navbar /> : <MainNav session={session} />}
            {children}
          </ClientProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
