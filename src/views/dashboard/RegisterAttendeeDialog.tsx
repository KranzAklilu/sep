"use client";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";
import { Event } from "@prisma/client";
import { CldImage, CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/navigation";

const RegisterAttendeeDialog = ({
  userId,
  event,
}: {
  userId: string;
  event: Event & {
    telebirrAccount: string | null;
    cbeAccount: string | null;
    boaAccount: string | null;
  };
}) => {
  const [usedPaymentMethod, setUsedPaymentMethod] = useState("");
  const [paymentProof, setPaymentProof] = useState("");

  const router = useRouter();
  const { mutateAsync: register, isLoading } =
    api.attendee.registerForAnEvent.useMutation({
      onSuccess: () => {
        toast({ title: "Thanks for paying! please way for approval" });
        router.push("/dashboard");
      },
      onError: (err) => {
        toast({ title: "unexpected error has occured" });
        console.log(err);
      },
    });

  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <div>
          <Button className="w-auto" variant="outline">
            Register
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="py-10 sm:max-w-md">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!paymentProof) {
              return toast({
                title: "paymet proof required",
                variant: "destructive",
              });
            }
            await register({
              userId,
              eventId: event.id,
              usedPaymentMethod,
              paymentProof,
            });
          }}
        >
          <div>
            <Badge className="mb-8 text-xl">ETB {event.price}</Badge>
          </div>
          <RadioGroup
            value={usedPaymentMethod}
            onValueChange={setUsedPaymentMethod}
            defaultValue="comfortable"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="telebirr" id="telebirr" />
              <Label htmlFor="telebirr">
                Telebirr: {event?.telebirrAccount}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">
                CBE:
                {event?.cbeAccount}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="boa" id="r3" />
              <Label htmlFor="r3">BOA: {event?.boaAccount}</Label>
            </div>
          </RadioGroup>
          <div className="">
            {paymentProof && (
              <CldImage
                width="960"
                height="600"
                src={paymentProof}
                sizes="100vw"
                alt="Proof of payment"
              />
            )}
            <CldUploadButton
              options={{ multiple: false }}
              uploadPreset={"knzk48be"}
              onSuccess={(data) => {
                setPaymentProof((data.info as any).url as string);
              }}
            >
              <Button variant="outline">Upload proof of payment</Button>
            </CldUploadButton>
          </div>
          <DialogFooter>
            <Button isLoading={isLoading} type="submit">
              Mark as paid
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default RegisterAttendeeDialog;
