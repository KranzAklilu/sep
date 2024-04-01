import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { api } from "~/trpc/react";
import { signIn } from "next-auth/react";
import { UserRole } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "~/components/ui/use-toast";

const schema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
});

export function CreateUserDialog() {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync } = api.user.create.useMutation({
    onError(err) {
      console.log(err.shape?.message);
      toast({
        title: err.shape?.message ?? "Something went wrongiio",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    setIsLoading(true);
    try {
      const user = await mutateAsync({ ...data });
      if (!user) return;
      const res = await signIn("email", {
        email: user.email,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      console.log(res);
      if (res && !res?.ok && res.error) {
        toast({
          title:
            JSON.parse(res.error ?? "").message ?? "Something went wrongss",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setOpenDialog(false);
      const utils = api.useContext();
      toast({
        title: "Sent out authentication message",
      });
      await utils.user.getUsers.invalidate();
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">Add a user</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add a user</DialogTitle>
            </DialogHeader>
            <div className="mt-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.Admin}>Admin</SelectItem>
                        <SelectItem value={UserRole.Viewer}>Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      You can change this setting later{" "}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button isLoading={isLoading} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
