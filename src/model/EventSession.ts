import { Event } from "./Event"; // Assuming Event model is defined similarly

export class EventSession {
  id: string;
  name: string;
  time: Date;
  createdAt: Date;
  event?: Event;
  eventId?: string;

  constructor(
    id: string,
    name: string,
    time: Date,
    createdAt: Date = new Date(),
    event?: Event,
    eventId?: string,
  ) {
    this.id = id;
    this.name = name;
    this.time = time;
    this.createdAt = createdAt;
    this.event = event;
    this.eventId = eventId;
  }
}
