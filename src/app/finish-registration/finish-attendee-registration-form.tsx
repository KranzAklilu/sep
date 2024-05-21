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
import { userUpdateSchema as schema } from "~/lib/validation/user";

export default function FinishAttendeeRegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });
  const { mutateAsync, isLoading } = api.user.update.useMutation({
    onSuccess: () => {
      toast({ title: "Updated data successfully" });
      router.push("/events");
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
                  <FormLabel htmlFor="email">full name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
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
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <FormControl>
                    <Input id="phone" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <FormControl>
                    <Input id="address" {...field} disabled={isLoading} />
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
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
