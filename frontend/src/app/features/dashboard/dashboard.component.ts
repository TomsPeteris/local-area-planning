import { Component } from "@angular/core";
import { FeedComponent } from "../feed/feed.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  standalone: true,
  imports: [FeedComponent],
})
export class DashboardComponent {}
