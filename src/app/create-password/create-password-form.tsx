"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { signIn, signOut } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import { Session } from "next-auth";
import { api } from "~/trpc/react";

const schema = z.object({
  name: z.string().optional(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

export function CreatePasswordForm({ user }: { user: Session["user"] }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { mutateAsync } = api.user.createPassword.useMutation({
    onError(err) {
      toast({ title: err.message || "Something went wrong" });
      setIsLoading(false);
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      if (data.password !== data.confirmPassword) {
        form.setError("confirmPassword", {
          message: "Passwords do not match",
        });
        return;
      }

      setIsLoading(true);

      const user = await mutateAsync({ ...data });

      if (user) {
        toast({
          title: "Password created successfuly",
        });

        await signIn("credentials", {
          email: user.email,
          password: data.password,
          callbackUrl: "/dashboard",
          redirect: true,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Jhon doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{
                  validate: (value) => {
                    return value === form.watch("password")
                      ? true
                      : "Passwords do not match";
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="mt-2" isLoading={isLoading}>
              Create password
            </Button>
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="link" type="button">
                    Login to another account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to stop the current authentication
                      process
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will not be able to continue authentication for{" "}
                      {user.name}.
                      <br />
                      Cancel to create password and continue authentication.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        await signOut();
                        router.push("/login");
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
