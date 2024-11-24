import { User } from "../models/user.interface";

export const USERS: User[] = [
  {
    id: "1",
    email: "resident@account.com",
    firstName: "Resident",
    lastName: "User",
    role: "resident",
    password: "1234",
  },
  {
    id: "2",
    email: "business@account.com",
    firstName: "Business",
    lastName: "User",
    role: "business",
    password: "1234",
  },
  {
    id: "3",
    email: "authority@account.com",
    firstName: "Authority",
    lastName: "User",
    role: "authority",
    password: "1234",
  },
];
