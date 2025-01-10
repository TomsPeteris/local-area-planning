import { User } from "../models/user.interface";

export const USERS: User[] = [
  {
    id: "1",
    email: "resident@account.com",
    username: "Resident User",
    firstName: "Resident",
    lastName: "User",
    permissions: "resident",
    password: "1234",
  },
  {
    id: "2",
    email: "business@account.com",
    username: "Business User",
    firstName: "Business",
    lastName: "User",
    permissions: "bussiness",
    password: "1234",
  },
  {
    id: "3",
    email: "authority@account.com",
    username: "Authority User",
    firstName: "Authority",
    lastName: "User",
    permissions: "authority",
    password: "1234",
  },
];
