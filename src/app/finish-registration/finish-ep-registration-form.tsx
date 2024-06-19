"use client";

import { Button } from "~/components/ui/button";

import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function FinishEpRegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [licenceDocumentUrl, setLicenceUrlDocument] = useState("");
  const [telebirr, setTelebirr] = useState("");
  const [cbe, setCbe] = useState("");
  const [boa, setBoa] = useState("");
  const [phone, setPhone] = useState("");

  const { mutateAsync, isLoading } = api.user.update.useMutation({
    onSuccess: async () => {
      // await signIn("credentials", {
      //   email: credParsed.email,
      //   password: credParsed.password,
      // });

      // router.refresh()
      router.push("/dashboard");
      toast({
        title:
          "successfully filled in all the required details. please wait for approval",
      });
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
          telebirr,
          cbe,
          boa,
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
          <CldUploadButton
            options={{ multiple: false }}
            uploadPreset={"knzk48be"}
            onSuccess={(data) => {
              if (!data) return;
              setLicenceUrlDocument((data.info as any).url as string);
            }}
          >
            <Button variant="outline">Upload business licence document</Button>
          </CldUploadButton>
          <div className="">
            <Label htmlFor="telebirr">Your telebirr account phone number</Label>
            <Input
              id="telebirr"
              name="telebirr"
              value={telebirr}
              onChange={(e) => setTelebirr(e.target.value)}
              required
            />
          </div>
          <div className="">
            <Label htmlFor="cbe">Your CBE account no.</Label>
            <Input
              id="cbe"
              name="cbe"
              value={cbe}
              onChange={(e) => setCbe(e.target.value)}
              required
            />
          </div>
          <div className="">
            <Label htmlFor="boa">Your BOA account no.</Label>
            <Input
              id="boa"
              name="boa"
              value={boa}
              onChange={(e) => setBoa(e.target.value)}
              required
            />
          </div>
          <div className="">
            <Label htmlFor="phone">Your phone no.</Label>
            <Input
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
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
