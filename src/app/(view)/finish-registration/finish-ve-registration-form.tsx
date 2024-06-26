"use client";

import { Button } from "~/components/ui/button";

import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

export default function FinishVeRegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [licenceDocumentUrl, setLicenceUrlDocument] = useState("");
  const [phone, setPhone] = useState("");

  const { mutateAsync, isLoading } = api.vendor.providesShowcase.useMutation({
    onSuccess: async () => {
      const cred = localStorage.getItem("cert");
      if (!cred) return;
      const credParsed = JSON.parse(cred);

      await signIn("credentials", {
        email: credParsed.email,
        password: credParsed.password,
      });
      router.refresh();
      router.push("/dashboard");
      toast({ title: "updated successfully" });
    },
    onError: (err) => {
      toast({ title: "unexpected error has occured" });
      console.log(err);
    },
  });

  return (
    <form
      className="flex items-center py-10"
      onSubmit={async (e) => {
        e.preventDefault();
        await mutateAsync({
          licenceDocument: licenceDocumentUrl,
          phone,
        });
      }}
    >
      <div className="mx-auto w-full max-w-2xl space-y-6 rounded-lg border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Finish your registration</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            we need all the data to proceed
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <CldUploadButton
            options={{ multiple: false }}
            uploadPreset={"knzk48be"}
            onSuccess={(data) => {
              if (!data) return;
              setLicenceUrlDocument((data.info as any).url as string);
            }}
          >
            <Button variant="outline">Upload licence</Button>
          </CldUploadButton>

          <div className="flex flex-col items-center gap-3">
            <Button
              isLoading={isLoading}
              type="submit"
              className="w-full"
              size="lg"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
