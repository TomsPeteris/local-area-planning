import { User } from "../models/user.interface";

export const USERS: User[] = [
  {
    id: "1",
    email: "resident@account.com",
    firstName: "Resident",
    lastName: "User",
    roles: ["resident"],
    password: "1234",
  },
  {
    id: "2",
    email: "business@account.com",
    firstName: "Business",
    lastName: "User",
    roles: ["business"],
    password: "1234",
  },
  {
    id: "3",
    email: "authority@account.com",
    firstName: "Authority",
    lastName: "User",
    roles: ["authority"],
    password: "1234",
  },
];
