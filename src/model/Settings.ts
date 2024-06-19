import { User } from "./User"; // Assuming User model is defined similarly

export class Settings {
  id: string;
  telebirrAccount?: string;
  cbeAccount?: string;
  boaAccount?: string;
  createdAt: Date;
  user: User;
  userId: string;

  constructor(
    id: string,
    user: User,
    userId: string,
    telebirrAccount?: string,
    cbeAccount?: string,
    boaAccount?: string,
    createdAt: Date = new Date(),
  ) {
    this.id = id;
    this.telebirrAccount = telebirrAccount;
    this.cbeAccount = cbeAccount;
    this.boaAccount = boaAccount;
    this.createdAt = createdAt;
    this.user = user;
    this.userId = userId;
  }
}
