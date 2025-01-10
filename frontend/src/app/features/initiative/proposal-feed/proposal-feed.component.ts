import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { TokenComponent } from "../../../shared/ui/token/token.component";
import { SplitterComponent } from "../../../shared/ui/splitter/splitter.component";
import { Proposal } from "../../../core/models/initiative.interface";

@Component({
  selector: "app-proposal-feed",
  templateUrl: "./proposal-feed.component.html",
  styleUrls: ["./proposal-feed.component.scss"],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TokenComponent,
    SplitterComponent,
    RouterLink,
  ],
})
export class ProposalFeedComponent {
  @Input() pageTitle = "";
  @Input() userId: string | undefined = undefined;
  @Input() items: Proposal[] | undefined = undefined;
  @Input() isLoading = false;

  date = new Date();
}
