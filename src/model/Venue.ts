import { Event } from "./Event"; // Assuming Event model is defined similarly
import { EventVenue } from "./EventVenue";
import { User } from "./User"; // Assuming User model is defined similarly

export class Venue {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  phone: string;
  pricePerHour: number;
  availableDate: number[];
  openHour: string;
  closeHour: string;
  lat?: number;
  lng?: number;
  createdAt: Date;
  updatedAt: Date;
  events: Event[];
  owner: User;
  ownerId: string;
  eventVenues: EventVenue[];

  constructor(
    id: string,
    name: string,
    description: string,
    location: string,
    capacity: number,
    phone: string,
    pricePerHour: number,
    availableDate: number[],
    openHour: string,
    closeHour: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    events: Event[] = [],
    owner: User,
    ownerId: string,
    eventVenues: EventVenue[] = [],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.location = location;
    this.capacity = capacity;
    this.phone = phone;
    this.pricePerHour = pricePerHour;
    this.availableDate = availableDate;
    this.openHour = openHour;
    this.closeHour = closeHour;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.events = events;
    this.owner = owner;
    this.ownerId = ownerId;
    this.eventVenues = eventVenues;
  }
}
