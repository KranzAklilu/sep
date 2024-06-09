import { MailIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import Logo from "./logo";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="bg-primary p-1 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="h-20 w-20">
          <Logo />
        </div>
        <div className="flex space-x-4">
          <Link className="hover:underline" href="#">
            Home
          </Link>
          <Link className="hover:underline" href="/events">
            All Events
          </Link>
          <Link className="hover:underline" href="/dashboard">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
