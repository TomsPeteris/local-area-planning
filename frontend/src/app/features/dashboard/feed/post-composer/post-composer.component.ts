import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-post-composer",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    NgOptimizedImage,
  ],
  templateUrl: "./post-composer.component.html",
  styleUrls: ["./post-composer.component.scss"],
})
export class PostComposerComponent {
  postContent = "";

  createPost(): void {
    if (this.postContent.trim()) {
      // Implement post creation logic
      console.log("Creating post:", this.postContent);
      this.postContent = "";
    }
  }
}
