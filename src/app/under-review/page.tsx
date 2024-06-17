"use client";
import { signIn } from "next-auth/react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function Page() {
  const router = useRouter();
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Image
        src="/under-review.png"
        alt="under review"
        width={500}
        height={500}
      />
      <p>your application is under review, this might take 3 - 4 hours</p>
      <Button
        onClick={async () => {
          const cred = localStorage.getItem("cert");
          if (!cred) return;
          const credParsed = JSON.parse(cred);

          await signIn("credentials", {
            email: credParsed.email,
            password: credParsed.password,
          });
          router.refresh();
          router.push("/dashboard");
        }}
      >
        Refresh
      </Button>
    </div>
  );
}
