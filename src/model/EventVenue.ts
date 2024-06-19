import { Venue } from "./Venue"; // Assuming Venue model is defined similarly
import { Event } from "./Event"; // Assuming Event model is defined similarly

export class EventVenue {
  id: string;
  venue: Venue;
  event: Event;
  accepted: boolean;
  rejected: boolean;
  createdAt: Date;
  venueId: string;
  eventId: string;

  constructor(
    id: string,
    venue: Venue,
    event: Event,
    accepted: boolean = false,
    rejected: boolean = false,
    createdAt: Date = new Date(),
    venueId: string,
    eventId: string,
  ) {
    this.id = id;
    this.venue = venue;
    this.event = event;
    this.accepted = accepted;
    this.rejected = rejected;
    this.createdAt = createdAt;
    this.venueId = venueId;
    this.eventId = eventId;
  }
}
