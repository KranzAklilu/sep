"use client";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";

const GiveFeedback = ({
  feedbackQuestions,
  eventId,
}: {
  feedbackQuestions: string[];
  eventId: string;
}) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState(
    feedbackQuestions.map((_, idx) => `${++idx}: \n`).join("\n"),
  );

  const { mutateAsync } = api.attendee.giveFeedback.useMutation({
    onSuccess: () => {
      toast({ title: "Feedback given" });
    },
    onError: (err) => {
      toast({ title: "unexpected error has occured" });
      console.log(err);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Give feedback</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Give feedback</DialogTitle>
          <DialogDescription>
            this will be shared with the event planner
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label>Rating</Label>
          <Input
            value={rating}
            min={0}
            max={5}
            onChange={(event) => setRating(parseInt(event.target.value))}
          />
        </div>
        <div>
          {feedbackQuestions.map((f, i) => (
            <div>
              <span>
                Question {++i}: {f}
              </span>
            </div>
          ))}
          {!!feedbackQuestions.length && (
            <Textarea
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              rows={8}
            />
          )}
        </div>
        <DialogClose>
          <Button
            onClick={async (e) => {
              await mutateAsync({ rating, comment: feedback, eventId });
            }}
          >
            Save
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
export default GiveFeedback;
