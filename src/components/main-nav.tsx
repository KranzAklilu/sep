"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Logo from "~/components/logo";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import { cn } from "~/lib/utils";
import { Session } from "next-auth";
import { UserRole } from "@prisma/client";

const links = [
  {
    href: "/",
    label: "Home",
    roles: [
      UserRole.ADMIN,
      UserRole.Attendee,
      UserRole.EventPlanner,
      UserRole.VenueOwner,
      UserRole.Vendor,
    ],
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    roles: [UserRole.Attendee, UserRole.EventPlanner],
  },
  {
    href: "/events",
    label: "Events",
    roles: [UserRole.Attendee],
  },
  {
    href: "/vendors",
    label: "Vendors",
    roles: [UserRole.EventPlanner],
  },
  {
    href: "/venues",
    label: "Venues",
    roles: [UserRole.EventPlanner],
  },
  {
    href: "/settings",
    label: "Settings",
    roles: [UserRole.EventPlanner],
  },
];

export function MainNav({ session }: { session: Session }) {
  console.log(session);
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Logo />

        <nav className={cn("flex items-center space-x-4 lg:space-x-6")}>
          {links
            .filter(({ roles }) => roles.includes(session.user.role))
            .map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {label}
              </Link>
            ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image ?? ""} alt="@shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => await signOut()}>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
