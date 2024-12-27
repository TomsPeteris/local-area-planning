import { inject, Injectable, signal } from "@angular/core";
import { FeedItem } from "../models/feed-item.interface";
import { UserService } from "./user.service";
import { delay, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class InitiativeService {
  private readonly initiativeSignal = signal<FeedItem[]>([]);
  private readonly userService = inject(UserService);

  createInitiative(rawInitiative: FeedItem): Observable<boolean> {
    const user = this.userService.getCurrentUser();

    if (!user) {
      return of(false).pipe(delay(2000));
    }

    const newFeed: FeedItem = {
      id: new Date().getTime().toString(),
      title: rawInitiative.title,
      description: rawInitiative.description,
      stage: "draft",
      author: user,
    };

    const currentFeeds = this.initiativeSignal();
    this.initiativeSignal.set([...currentFeeds, newFeed]);

    return of(true).pipe(delay(2000));
  }
}
