"use client";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utils";

import { eventEditSchema as schema } from "~/lib/validation/event";
import { api } from "~/trpc/react";
import { toast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { Event } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export function EditEventDialog({
  event,
  venues,
}: {
  event: Event;
  venues: { id: string; name: string }[];
}) {
  const contentState = ContentState.createFromBlockArray(
    htmlToDraft(event.description).contentBlocks,
  );
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState),
  );

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const utils = api.useUtils();

  const params = useSearchParams();
  const pathname = usePathname();

  const { mutateAsync } = api.event.editEvent.useMutation({
    onSuccess: async () => {
      toast({ title: "Successfully edited" });
      utils.event.getMany.invalidate();
      setOpen(false);
      router.refresh();
    },
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: event.name,
      startTime: event.startTime,
      endTime: event.endTime,
      date: event.date,
      price: event.price,
      description: event.description,
      attendeeLimit: event.attendeeLimit,
    },
  });

  useEffect(() => {
    if (params.get("edit-event")) {
      setOpen(true);
    }
  }, []);

  async function onSubmit(values: z.infer<typeof schema>) {
    await mutateAsync({ ...values, id: event.id });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open) {
          router.push("?edit-event=1");
        } else {
          router.push(pathname);
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="max-h-[800px] space-y-8 overflow-y-scroll"
          >
            <DialogHeader>
              <DialogTitle>Create event</DialogTitle>
              <DialogDescription>
                this will active the event immediately
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel htmlFor="name" className="text-right">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Jano band concert"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel htmlFor="name" className="text-right">
                      Price
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange as any}
                        />
                        <Input
                          type="time"
                          className="mt-2"
                          // take locale date time string in format that the input expects (24hr time)
                          value={field.value.toLocaleTimeString([], {
                            hourCycle: "h23",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          // take hours and minutes and update our Date object then change date object to our new value
                          onChange={(selectedTime) => {
                            const currentTime = field.value;
                            currentTime.setHours(
                              parseInt(
                                selectedTime.target.value.split(":")[0] || "",
                              ),
                              parseInt(
                                selectedTime.target.value.split(":")[1] || "",
                              ),
                              0,
                            );
                            field.onChange(currentTime);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=" flex justify-between gap-6">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-2">
                      <FormLabel htmlFor="password">Start time</FormLabel>
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
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-2">
                      <FormLabel htmlFor="password">End Time</FormLabel>
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
                name="attendeeLimit"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel htmlFor="name" className="text-right">
                      Attendee limit
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={() => (
                  <FormItem className="col-span-3">
                    <FormLabel htmlFor="name" className="text-right">
                      Description
                    </FormLabel>
                    <FormControl>
                      <div>
                        <Editor
                          editorState={editorState}
                          wrapperClassName="demo-wrapper"
                          editorClassName="border min-h-[400px]"
                          onEditorStateChange={(editorState) => {
                            setEditorState(editorState);
                            form.setValue(
                              "description",
                              draftToHtml(
                                convertToRaw(editorState.getCurrentContent()),
                              ),
                            );
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Edit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
