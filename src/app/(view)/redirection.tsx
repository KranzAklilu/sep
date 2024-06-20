"use client";

import { Settings, User, Venue } from "@prisma/client";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Redirection({
  dbUser,
}: {
  dbUser: (User & { Venue: Venue | null; Setting: Settings | null }) | null;
}) {
  const pathname = usePathname();

  if (!dbUser) return null;

  console.log(pathname);
  console.log({ dbUser });
  const esc = pathname === "/login" || pathname === "/register";
  if (esc) return null;

  useEffect(() => {}, []);

  useEffect(() => {
    if (dbUser?.role === "EventPlanner") {
      if (
        !dbUser?.licenceDocument ||
        !dbUser?.Setting?.telebirrAccount ||
        !dbUser.Setting.cbeAccount ||
        !dbUser.Setting.boaAccount
      ) {
        if (pathname !== "/finish-registration") {
          return redirect("/finish-registration");
        } else {
          return;
        }
      } else {
        if (pathname === "/finish-registration") {
          return redirect("/dashboard");
        }
      }
    } else if (dbUser?.role === "VenueOwner") {
      if (
        !dbUser.Venue?.name ||
        !dbUser.Venue?.location ||
        !dbUser.Venue?.pricePerHour ||
        !dbUser.Venue?.capacity ||
        !dbUser.Venue?.phone ||
        !dbUser.Venue?.openHour ||
        !dbUser.Venue?.closeHour ||
        !dbUser.Venue?.availableDate
      ) {
        if (pathname !== "/finish-registration") {
          return redirect("/finish-registration");
        } else {
          return;
        }
      } else {
        if (pathname === "/finish-registration") {
          return redirect("/dashboard");
        }
      }
    } else if (dbUser?.role === "Vendor") {
      if (!dbUser.phone || !dbUser.licenceDocument) {
        if (pathname !== "/finish-registration") {
          return redirect("/finish-registration");
        } else {
          return;
        }
      } else {
        if (pathname === "/finish-registration") {
          return redirect("/dashboard");
        }
      }
    }

    if (dbUser.approved === null && dbUser.role !== "Attendee") {
      if (pathname !== "/under-review") {
        return redirect("/under-review");
      } else {
        return;
      }
    } else if (dbUser.approved === false) {
      if (pathname !== "/rejected") {
        return redirect("/rejected");
      } else {
        return;
      }
    } else {
      if (pathname === "/under-review") {
        return redirect("/dashboard");
      }
    }
  }, [pathname]);
  return null;
}
