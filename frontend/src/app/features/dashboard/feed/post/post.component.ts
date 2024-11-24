import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { NgOptimizedImage } from "@angular/common";

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
  selector: "app-post",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, NgOptimizedImage],
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"],
})
export class PostComponent {
  @Input({ required: true }) post!: Post;
}
