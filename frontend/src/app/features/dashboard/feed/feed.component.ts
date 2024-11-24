import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { NgOptimizedImage } from "@angular/common";
import { PostComponent } from "./post/post.component";
import { PostComposerComponent } from "./post-composer/post-composer.component";

interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatarUrl: string;
  };
  content: string;
  timestamp: Date;
  stats: {
    replies: number;
    reposts: number;
    likes: number;
    views: number;
  };
}

@Component({
  selector: "app-feed",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    PostComponent,
    PostComposerComponent,
  ],
  templateUrl: "./feed.component.html",
  styleUrls: ["./feed.component.scss"],
})
export class FeedComponent {
  posts: Post[] = [
    {
      id: "1",
      author: {
        name: "John Doe",
        handle: "@johndoe",
        avatarUrl: "assets/avatars/user1.jpg",
      },
      content:
        "Just deployed my first Angular application! 🚀 #Angular #WebDev",
      timestamp: new Date(),
      stats: {
        replies: 5,
        reposts: 2,
        likes: 15,
        views: 1200,
      },
    },
    // Add more sample posts as needed
  ];
}
