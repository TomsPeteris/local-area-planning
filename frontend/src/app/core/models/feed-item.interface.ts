import { User } from "./user.interface";

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  goal: string;
  tags: string[];
  createdAt?: Date;
  stage: "published" | "draft";
  author: User;
  phoneNumber: string;
  startDate: string;
}
