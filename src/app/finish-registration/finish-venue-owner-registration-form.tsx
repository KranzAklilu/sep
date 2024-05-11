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
import Link from "next/link";
import { api } from "~/trpc/react";
import { venueCreateSchema as schema } from "~/lib/validation/venue";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { addDays, format, startOfWeek } from "date-fns";

export default function FinishVenueOwnerRegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      availableDate: [],
    },
  });
  const { mutateAsync, isLoading } = api.venue.create.useMutation({
    onSuccess: () => {
      router.push("/inquiries");
      toast({ title: "Registered successfully" });
    },
    onError: (err) => {
      toast({ title: "unexpected error has occured" });
      console.log(err);
    },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    await mutateAsync({
      ...data,
    });
  }

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
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="email">Venue name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="password">Description</FormLabel>
                  <FormControl>
                    <Textarea disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="password">Location</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="password">phone</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="password">capacity</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricePerHour"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="password">pricePerHour</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className=" flex justify-between gap-6">
              <FormField
                control={form.control}
                name="openHour"
                render={({ field }) => (
                  <FormItem className="w-full space-y-2">
                    <FormLabel htmlFor="password">openHour</FormLabel>
                    <FormControl>
                      <Input
                        id="range-end-time"
                        required
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="closeHour"
                render={({ field }) => (
                  <FormItem className="w-full space-y-2">
                    <FormLabel htmlFor="password">closeHour</FormLabel>
                    <FormControl>
                      <Input
                        id="range-end-time"
                        required
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="availableDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="password">Available Date</FormLabel>
                  <FormControl>
                    <div>
                      {[0, 1, 2, 3, 4, 5, 6].map((day, index) => (
                        <div className="space-x-2" key={index}>
                          <Checkbox
                            id={`daysOfWeek[${index}]`}
                            onCheckedChange={() => {
                              const currentValues = field.value.includes(index)
                                ? field.value.filter((day) => day !== index)
                                : [...field.value, index];

                              form.setValue("availableDate", currentValues);
                            }}
                            checked={form
                              .watch("availableDate")
                              .includes(index)}
                          />
                          <Label htmlFor={`daysOfWeek[${index}]`}>
                            {format(
                              addDays(startOfWeek(new Date()), index + 1),
                              "EEEEEEE",
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center gap-3">
              <Button
                isLoading={isLoading}
                type="submit"
                className="w-full"
                size="lg"
              >
                Continue
              </Button>

              <span>---or---</span>

              <Link
                href="/register"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
