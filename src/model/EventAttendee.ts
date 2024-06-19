import { User } from "./User"; // Assuming User model is defined similarly
import { Event } from "./Event"; // Assuming Event model is defined similarly

export class EventAttendee {
  id: string;
  user: User;
  event: Event;
  approved: boolean;
  usedPaymentMethod: string;
  paymentProof: string;
  createdAt: Date;
  userId: string;
  eventId: string;

  constructor(
    id: string,
    user: User,
    event: Event,
    approved: boolean = false,
    usedPaymentMethod: string,
    paymentProof: string,
    createdAt: Date = new Date(),
    userId: string,
    eventId: string,
  ) {
    this.id = id;
    this.user = user;
    this.event = event;
    this.approved = approved;
    this.usedPaymentMethod = usedPaymentMethod;
    this.paymentProof = paymentProof;
    this.createdAt = createdAt;
    this.userId = userId;
    this.eventId = eventId;
  }
}
