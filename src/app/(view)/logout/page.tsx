"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Component() {
  useEffect(() => {
    signOut({
      callbackUrl: "/login",
    });
  }, []);
  return <p>logging out... </p>;
}
