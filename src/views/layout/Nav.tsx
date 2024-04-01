"use client";
import { BookTextIcon, BringToFrontIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";
import { UserRole } from "@prisma/client";
import { Session } from "next-auth";

const links = [
  {
    name: "Home",
    Icon: <BringToFrontIcon />,
    url: "/",
    role: [UserRole.Admin, UserRole.Viewer],
  },
  {
    name: "Document",
    Icon: <BookTextIcon />,
    url: "/documents",
    role: [UserRole.Admin, UserRole.Viewer],
  },
  {
    name: "Users",
    Icon: <UserRoundIcon />,
    url: "/users",
    role: [UserRole.Admin],
  },
];

export default function Nav({ session }: { session: Session }) {
  const pathname = usePathname();
  console.log(session);
  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      {links
        .filter((link) => link.role.includes(session.user.role))
        .map((link, idx) => (
          <Link
            key={idx}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              ((pathname.endsWith("/dashboard") && link.url === "/") ||
                pathname.endsWith(link.url)) &&
                "bg-gray-100",
            )}
            href={"/dashboard" + link.url}
          >
            {link.Icon}
            {link.name}
          </Link>
        ))}
    </nav>
  );
}
