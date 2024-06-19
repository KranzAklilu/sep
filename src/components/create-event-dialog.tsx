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
import { add, format } from "date-fns";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  InfoIcon,
  XCircleIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";

import { ContentState, EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";

import { eventOrderSchema as schema } from "~/lib/validation/event";
import { api } from "~/trpc/react";
import { toast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from "html-to-draftjs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import Link from "next/link";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";

const defaultSessionText = `
Session Title: [Title of the Session]\n

Time:
- Start Time: [Start Time]           \n
- End Time: [End Time]               \n
                                     \n
Description:                         \n
[Brief description of what the session will cover]\n
                                     \n
Speaker(s):                          \n
- [Speaker 1 Name]                   \n
- [Speaker 2 Name]                   \n
                                     \n
Location/building no:                \n
[Location of the Session]            \n
                                     \n
Notes:                               \n
[Any additional notes or information]\n
`;
export function CreateEventDialog({
  venues,
}: {
  venues: { id: string; name: string; location: string }[];
}) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [currentSession, setCurrentSession] = useState(defaultSessionText);

  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  const params = useSearchParams();
  const router = useRouter();
  const { mutateAsync } = api.event.createEvent.useMutation({
    onSuccess: async () => {
      toast({ title: "Successfully created event" });
      utils.event.getMany.invalidate();
      utils.event.getMy.invalidate();
      setOpen(false);
    },
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      date: new Date(),
      session: [],
      venue: params.get("venue") || undefined,
    },
  });

  const defaultDescriptionEditorText = `
<h1>🎉 Welcome to ${form.watch("name")}! 🎉</h1>
Join us for an unforgettable experience at ${form.watch("name")}, where innovation meets excitement in the heart of ${venues.find(({ id }) => form.watch("venue") === id)?.location}. Get ready to immerse yourself in a day (or days) filled with inspiration, learning, and connection.
📅 Date: ${form.watch("date")}
📍 Location: ${venues.find(({ id }) => form.watch("venue") === id)?.location}
About ${form.watch("name")}:
${form.watch("name")} is not just an event; it's a celebration of [Industry/Theme]. Whether you're a seasoned professional, an aspiring enthusiast, or simply curious about [Event Theme], there's something here for everyone. From captivating keynote speakers to interactive workshops, from networking opportunities to hands-on demonstrations, ${form.watch("name")} promises to ignite your passion and propel you forward.
What to Expect:
✨ Inspiring Speakers: Be inspired by industry leaders and visionaries who will share their insights and expertise.
🌟 Engaging Workshops: Dive deep into topics that matter to you with hands-on workshops and interactive sessions.
🤝 Networking: Connect with like-minded individuals, forge new partnerships, and expand your professional network.
🎨 Interactive Exhibits: Explore the latest innovations and trends through interactive exhibits and showcases.
🎁 Surprises: Expect the unexpected! ${form.watch("name")} is full of surprises and special moments that will leave you inspired and energized.
Who Should Attend:
${form.watch("name")} welcomes professionals, enthusiasts, students, entrepreneurs, and anyone passionate about [Event Theme]. Whether you're looking to learn, network, or simply be inspired, you'll find your place among our diverse community of attendees.
Get Involved:
Ready to be part of something extraordinary? Join us at ${form.watch("name")} and unlock endless opportunities for growth, learning, and collaboration. Reserve your spot today and embark on a journey to elevate your [Industry/Interest] experience to new heights!
Connect with Us:
Follow us on [Social Media Platforms] for the latest updates, behind-the-scenes glimpses, and exclusive content leading up to ${form.watch("name")}. Have a question or need assistance? Don't hesitate to reach out to our friendly team at [Contact Information].
${form.watch("name")} is more than just an event; it's a community coming together to celebrate, learn, and grow. We can't wait to welcome you to the ${form.watch("name")} family!
`;

  useEffect(() => {
    if (params.get("create-event")) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    const contentState = ContentState.createFromBlockArray(
      htmlToDraft(defaultDescriptionEditorText).contentBlocks,
    );
    setEditorState(EditorState.createWithContent(contentState));
  }, [form.watch("name"), form.watch("date")]);

  async function onSubmit(values: z.infer<typeof schema>) {
    await mutateAsync({ ...values });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open) {
          router.push("?create-event=1");
        } else {
          router.push("/dashboard");
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">Add new event</Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll sm:max-w-5xl">
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
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-[200px] justify-between"
                          >
                            {field.value
                              ? venues.find(
                                  (framework) => framework.id === field.value,
                                )?.name
                              : "Select venue..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search venue..." />
                          <CommandEmpty>No venue found.</CommandEmpty>
                          <CommandGroup>
                            {venues.map((v) => (
                              <CommandItem
                                key={v.id}
                                value={v.name}
                                onSelect={(currentValue) => {
                                  field.onChange(
                                    venues.find(
                                      (v) =>
                                        v.name.toLowerCase() === currentValue,
                                    )?.id,
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === v.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <p className="w-full">{v.name}</p>
                                <Link href={`/venues/${v.id}`}>
                                  <InfoIcon className="h-4 w-4" />
                                </Link>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                          fromDate={add(new Date(), { days: 3 })}
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
                name="session"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel htmlFor="name" className="text-right">
                      Session
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={18}
                        value={currentSession}
                        onChange={(e) => setCurrentSession(e.target.value)}
                        defaultValue={defaultSessionText}
                      />
                    </FormControl>
                    <div className="space-x-2">
                      {form.watch("session").map((_, idx) => (
                        <Badge>
                          Session {++idx}{" "}
                          <XCircleIcon
                            onClick={() => {
                              form.setValue(
                                "session",
                                form
                                  .watch("session")
                                  .filter((_, i) => i !== idx),
                              );
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        form.setValue("session", [
                          ...form.watch("session"),
                          currentSession,
                        ]);
                        setCurrentSession(defaultSessionText);
                      }}
                    >
                      Add Another
                    </Button>
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
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
