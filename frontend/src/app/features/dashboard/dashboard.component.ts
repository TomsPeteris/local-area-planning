import { Component, ChangeDetectionStrategy } from "@angular/core";
import { FeedComponent } from "../feed/feed.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  standalone: true,
  imports: [FeedComponent],
})
export class DashboardComponent {}
