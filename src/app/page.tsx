import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import EventCard from "~/components/EventCard";
import Logo from "~/components/logo";
import Navbar from "~/components/navbar";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import AdminTables from "./_admin_tables";

const getEvents = async () => {
  const upcommingEvents = await db.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Venue: true,
      _count: {
        select: {
          EventAttendee: true,
        },
      },
    },
    take: 6,
  });
  const featuredEvents = await db.event.findMany({
    where: {
      featured: true,
    },

    include: {
      Venue: true,
    },
  });
  return {
    upcommingEvents,
    featuredEvents,
  };
};

export default async function LandingPage() {
  const { featuredEvents, upcommingEvents } = await getEvents();

  const session = await getServerSession(authOptions);

  if (session?.user.role === UserRole.VenueOwner) {
    return redirect("/dashboard/inquiries");
  }

  if (session?.user.role === UserRole.ADMIN) {
    return <AdminTables />;
  }

  return (
    <div className="bg-white">
      <header className="bg-[#2B6CB0] py-44 text-center text-white">
        <h2 className="mb-4 text-4xl font-bold">
          Discover Events & Workshops Around You
        </h2>
        <p className="mx-auto mb-6 max-w-2xl">
          Don&apos;t miss out on the experience of a lifetime - secure your spot
          at your preferable events with our easy online ticket purchasing
          system and join us for building a good community.
        </p>
        <div className="flex justify-center space-x-4">
          <Button className="">Check out events</Button>
          <Button className="" variant="secondary">
            About us
          </Button>
        </div>
      </header>
      <section className="py-10">
        <h3 className="mb-6 text-center text-3xl font-bold">Upcoming Events</h3>
        <div className="mb-6 flex justify-center space-x-2">
          <Button className="border-gray-300 text-gray-600" variant="outline">
            All Events
          </Button>
          <Button className="border-gray-300 text-gray-600" variant="outline">
            Corporate Events
          </Button>
          <Button className="border-gray-300 text-gray-600" variant="outline">
            Private Events
          </Button>
          <Button className="border-gray-300 text-gray-600" variant="outline">
            Charity Events
          </Button>
          <Button className="border-gray-300 text-gray-600" variant="outline">
            Festival Events
          </Button>
          <Button className="border-gray-300 text-gray-600" variant="outline">
            Sports Events
          </Button>
          <Button className="border-gray-300 text-gray-600" variant="outline">
            Concert Events
          </Button>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcommingEvents.map((event, idx) => (
            <EventCard
              event={event}
              remaining={event.attendeeLimit - event._count.EventAttendee}
              key={idx}
            />
          ))}
        </div>
      </section>
      <section className="bg-gray-100 py-10">
        <h3 className="mb-6 text-center text-3xl font-bold">How It Works</h3>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <SearchIcon className="mb-4 h-12 w-12" />
            <h4 className="mb-2 text-xl font-semibold">Find Events</h4>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Maxime,
              rerum beatae!
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <TicketIcon className="mb-4 h-12 w-12" />
            <h4 className="mb-2 text-xl font-semibold">Select Events</h4>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Maxime,
              rerum beatae!
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CheckIcon className="mb-4 h-12 w-12" />
            <h4 className="mb-2 text-xl font-semibold">Confirm Tickets</h4>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Maxime,
              rerum beatae!
            </p>
          </div>
        </div>
      </section>
      <section className="bg-primary py-10 text-white">
        <h3 className="mb-6 text-center text-3xl font-bold">
          Join 300+ Ongoing Events, Marathons, Parties, Movements
        </h3>
        <div className="mx-auto flex max-w-4xl items-center justify-around">
          <div className="flex flex-col items-center text-center">
            <Avatar>
              <AvatarImage
                alt="Mark Tony"
                src="/placeholder.svg?height=100&width=100"
              />
            </Avatar>
            <p className="my-4">
              &quot;Lorem ipsum dolor sit amet consectetur adipiscing elit.
              Voluptate consequatur!&quot;
            </p>
            <h5 className="text-xl font-semibold">Mark Tony</h5>
            <p className="text-sm">Software Developer</p>
          </div>
        </div>
      </section>
      <section className="py-10">
        <h3 className="mb-6 text-center text-3xl font-bold">Featured Events</h3>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event, idx) => (
            <EventCard event={event} key={idx} />
          ))}
        </div>
      </section>
      <footer className="bg-primary py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between md:flex-row">
          <div className="h-20 w-20">
            <Logo />
          </div>
          <div className="mb-4 flex space-x-4 md:mb-0">
            <Link className="hover:underline" href="#">
              Home
            </Link>
            <Link className="hover:underline" href="#">
              Events
            </Link>
            <Link className="hover:underline" href="#">
              Contact
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* facebok */}
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>

            {/* twitter */}
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>

            {/* insta */}
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>

            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function TicketIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
