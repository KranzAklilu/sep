"use client";

import { Input } from "~/components/ui/input";
import { Button, buttonVariants } from "~/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { signIn } from "next-auth/react";
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
import Link from "next/link";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function UserLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (res && !res?.ok && res.error) {
        toast({
          title: JSON.parse(res.error ?? "").message ?? "Something went wrong",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      if (res && res.ok) {
        router.push(res.url ?? "/dashboard");
        router.refresh();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast({ title: "Somethings went wrong", variant: "destructive" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-screen items-center">
          <div className="mx-auto max-w-sm space-y-6 rounded-lg border border-gray-200 bg-white px-6 py-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="sr-only" htmlFor="email">
                      Email
                    </FormLabel>
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
                    <FormLabel className="sr-only" htmlFor="password">
                      Password
                    </FormLabel>
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
              <div className="flex">
                <div className="flex-grow" />
                <Link
                  href="/forgot-password"
                  className={buttonVariants({ size: "sm", variant: "link" })}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Button
                  isLoading={isLoading}
                  type="submit"
                  className="w-full"
                  size="lg"
                >
                  Sign in
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
        </div>
      </form>
    </Form>
  );
}
