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
import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { UserRole } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { api } from "~/trpc/react";
import { userRegisterSchema as schema } from "~/lib/validation/user";

export default function UserRegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync, isLoading } = api.user.register.useMutation({
    onSuccess: () => {
      router.push("/login");
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-screen items-center">
          <div className="mx-auto max-w-sm space-y-6 rounded-lg border border-gray-200 bg-white px-6 py-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Register</h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="name">Full name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="jhon doe"
                        id="name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        type="password"
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select your role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={UserRole.Attendee} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Attendee
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={UserRole.EventPlanner} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Event planner
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={UserRole.VenueOwner} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Venue Owner
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={UserRole.Vendor} />
                          </FormControl>
                          <FormLabel className="font-normal">Vendor</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-8 w-full" size="lg">
                Register
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
