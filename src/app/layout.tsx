import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import ClientProvider from "~/views/layout/ClientProvider";
import Navbar from "~/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { MainNav } from "~/views/dashboard/main-nav";

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
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>
          <ClientProvider>
            {!session?.user ? <Navbar /> : <MainNav session={session} />}
            {children}
          </ClientProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
