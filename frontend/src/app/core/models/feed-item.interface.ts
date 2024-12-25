import { User } from "./user.interface";

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  stage: "published" | "draft";
  author: User;
}
