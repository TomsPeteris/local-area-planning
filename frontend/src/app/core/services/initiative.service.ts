import { inject, Injectable, Injector, signal } from "@angular/core";
import { FeedItem } from "../models/feed-item.interface";
import { UserService } from "./user.service";
import { delay, Observable, of } from "rxjs";
import { toObservable } from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: "root",
})
export class InitiativeService {
  private readonly initiativeSignal = signal<FeedItem[]>([
    {
      id: "1",
      title: "Downtown Revitalization Project Update",
      description:
        "Latest updates on the Main Street renovation project including timeline and community impact assessment.",
      createdAt: new Date(),
      stage: "published",
      goal: "Make all people happy",
      tags: ["Cool", "nice", "Super-puper"],
      phoneNumber: "+371 255 990 233",
      date: "12/23/23",
      author: {
        id: "u1",
        firstName: "Sarah",
        lastName: "Johnson",
        avatar: "assets/avatars/sarah.jpg",
        role: "resident",
      },
    },
    {
      id: "2",
      title: "New Zoning Proposals for Westside District",
      description:
        "Proposed changes to mixed-use development regulations in the Westside neighborhood.",
      createdAt: new Date(),
      stage: "draft",
      goal: "Make all people happy",
      tags: ["Cool", "nice", "Super-puper"],
      phoneNumber: "+371 255 990 233",
      date: "12/23/23",
      author: {
        id: "u2",
        firstName: "Michael",
        lastName: "Chen",
        avatar: "assets/avatars/michael.jpg",
        role: "business",
      },
    },
    {
      id: "3",
      title: "Green Space Initiative 2024",
      description:
        "Comprehensive plan for expanding public parks and sustainable urban spaces in residential areas.",
      createdAt: new Date(),
      stage: "published",
      goal: "Make all people happy",
      tags: ["Cool", "nice", "Super-puper"],
      phoneNumber: "+371 255 990 233",
      date: "12/23/23",
      author: {
        id: "u3",
        firstName: "Emma",
        lastName: "Davis",
        avatar: "assets/avatars/emma.jpg",
        role: "authority",
      },
    },
    {
      id: "4",
      title: "Public Transportation Enhancement Plan",
      description:
        "Proposed improvements to bus routes and new bicycle lanes connecting residential areas to downtown.",
      createdAt: new Date(),
      stage: "published",
      goal: "Make all people happy",
      tags: ["Cool", "nice", "Super-puper"],
      phoneNumber: "+371 255 990 233",
      date: "12/23/23",
      author: {
        id: "u1",
        firstName: "Sarah",
        lastName: "Johnson",
        avatar: "assets/avatars/sarah.jpg",
        role: "resident",
      },
    },
  ]);

  private readonly userService = inject(UserService);
  private injector = inject(Injector);

  createInitiative(rawInitiative: FeedItem): Observable<boolean> {
    const user = this.userService.getCurrentUser();

    if (!user) {
      return of(false).pipe(delay(2000));
    }

    const newFeed: FeedItem = {
      id: new Date().getTime().toString(),
      title: rawInitiative.title,
      description: rawInitiative.description,
      goal: rawInitiative.goal,
      tags: rawInitiative.tags,
      date: rawInitiative.date,
      phoneNumber: rawInitiative.phoneNumber,
      stage: "draft",
      author: user,
    };

    const currentFeeds = this.initiativeSignal();
    this.initiativeSignal.set([...currentFeeds, newFeed]);

    return of(true).pipe(delay(2000));
  }

  getInitiatives(): Observable<FeedItem[]> {
    return toObservable(this.initiativeSignal, {
      injector: this.injector,
    }).pipe(delay(1000));
  }

  getInitiative(initiativeId: string | null): FeedItem | undefined {
    if (initiativeId) {
      const initiative = this.initiativeSignal().find(
        initiative => initiative.id === initiativeId
      );
      return initiative;
    } else {
      return undefined;
    }
  }
}
