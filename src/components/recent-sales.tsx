"use client";
import { faker } from "@faker-js/faker";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      {Array(5)
        .fill(0)
        .map(() => {
          const person = faker.person;
          return (
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/05.png" alt="Avatar" />
                <AvatarFallback>{person.suffix()}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {person.fullName()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {faker.internet.email()}
                </p>
              </div>
              <div className="ml-auto font-medium">+ETB39.00</div>
            </div>
          );
        })}
    </div>
  );
}
