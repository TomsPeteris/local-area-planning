import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { FeedComponent } from "../feed/feed.component";
import { UserService } from "../../core/services/user.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-my-initiatives",
  imports: [FeedComponent],
  templateUrl: "./my-initiatives.component.html",
  styleUrl: "./my-initiatives.component.scss",
})
export class MyInitiativesComponent {
  private readonly userService = inject(UserService);
  currentUserId: string = this.userService.getCurrentUser()?.id || "";
}
