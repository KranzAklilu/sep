"use client";

import { Input } from "~/components/ui/input";
import { Button, buttonVariants } from "~/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { venueUpdateSchema as schema } from "~/lib/validation/venue";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { addDays, format, startOfWeek } from "date-fns";
import Autocomplete, { usePlacesWidget } from "react-google-autocomplete";
import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";

export default function FinishVenueOwnerRegistrationForm({
  data,
}: {
  data: any;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [licenceDocumentUrl, setLicenceUrlDocument] = useState("");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...data,
    },
  });
  const { mutateAsync, isLoading } = api.user.update.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
      toast({ title: "updated successfully" });
    },
    onError: (err) => {
      toast({ title: "unexpected error has occured" });
      console.log(err);
    },
  });

  async function onSubmit() {
    await mutateAsync({
      licenceDocument: licenceDocumentUrl,
    });
  }
  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    onPlaceSelected: (place) => {
      form.setValue("lng", place.geometry?.location?.lng());
      form.setValue("lat", place.geometry?.location?.lat());
    },
    options: {
      types: ["restaurant", "stadium", "shopping_mall"],
      componentRestrictions: { country: "et" },
    },
  });
  console.log(ref);

  return (
    <Form {...form}>
      <form
        className="flex items-center py-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="mx-auto w-full max-w-2xl space-y-6 rounded-lg border border-gray-200 bg-white px-6 py-8 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Finish your registration</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              we need all the data to proceed
            </p>
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CldUploadButton
              options={{ multiple: false }}
              uploadPreset={"knzk48be"}
              onSuccess={(data) => {
                if (!data) return;
                setLicenceUrlDocument((data.info as any).url as string);
              }}
            >
              <Button variant="outline">Upload licenced document</Button>
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
    </Form>
  );
}
