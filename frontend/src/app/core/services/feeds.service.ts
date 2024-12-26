import { inject, Injectable, signal } from "@angular/core";
import { FeedItem } from "../models/feed-item.interface";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class FeedsService {
  private readonly feedsSignal = signal<FeedItem[]>([]);
  private readonly userService = inject(UserService);

  submitFeed(rawFeed: FeedItem): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!rawFeed.title || !rawFeed.description) {
        return reject(new Error("Invalid feed!"));
      }

      this.userService.getCurrentUser().subscribe({
        next: user => {
          if (!user) {
            return reject(new Error("User not authenticated!"));
          }

          const newFeed: FeedItem = {
            id: new Date().getTime().toString(),
            title: rawFeed.title,
            description: rawFeed.description,
            createdAt: new Date(),
            stage: "draft",
            author: user,
          };

          const currentFeeds = this.feedsSignal();
          this.feedsSignal.set([...currentFeeds, newFeed]);
          resolve();
        },
        error: err => reject(err),
      });
    });
  }
}
