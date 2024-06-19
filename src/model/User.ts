import { Feedback } from "./Feedback"; // Assuming Feedback model is defined similarly
import { Event } from "./Event"; // Assuming Event model is defined similarly
import { Settings } from "./Settings"; // Assuming Settings model is defined similarly
import { Venue } from "./Venue"; // Assuming Venue model is defined similarly
import { EventAttendee } from "./EventAttendee";

export enum UserRole {
  Attendee = "Attendee",
  Organizer = "Organizer",
  Admin = "Admin",
}

export class User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  address?: string;
  password?: string;
  phone?: string;
  role: UserRole;
  licenceDocument?: string;
  approved?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  feedbacks: Feedback[];
  eventsOwned: Event[];
  eventsAttended: EventAttendee[];
  settings?: Settings;
  venue?: Venue;

  constructor(
    id: string,
    role: UserRole = UserRole.Attendee,
    createdAt: Date = new Date(),
    feedbacks: Feedback[] = [],
    eventsOwned: Event[] = [],
    eventsAttended: EventAttendee[] = [],
  ) {
    this.id = id;
    this.role = role;
    this.createdAt = createdAt;
    this.feedbacks = feedbacks;
    this.eventsOwned = eventsOwned;
    this.eventsAttended = eventsAttended;
  }
}
