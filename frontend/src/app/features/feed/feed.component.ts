import { Component, signal, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeedItem } from "../../core/models/feed-item.interface";
import { SplitterComponent } from "../../shared/ui/splitter/splitter.component";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TokenComponent } from "../../shared/ui/token/token.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-feed",
  templateUrl: "./feed.component.html",
  styleUrls: ["./feed.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TokenComponent,
    SplitterComponent,
  ],
})
export class FeedComponent {
  feedItems = signal<FeedItem[]>([
    {
      id: "1",
      title: "Downtown Revitalization Project Update",
      description:
        "Latest updates on the Main Street renovation project including timeline and community impact assessment.",
      createdAt: new Date(),
      stage: "published",
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
      author: {
        id: "u1",
        firstName: "Sarah",
        lastName: "Johnson",
        avatar: "assets/avatars/sarah.jpg",
        role: "resident",
      },
    },
  ]);
}
