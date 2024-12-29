import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { InitiativeService } from "../../../core/services/initiative.service";
import { FeedItem } from "../../../core/models/feed-item.interface";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { SplitterComponent } from "../../../shared/ui/splitter/splitter.component";
import { TokenComponent } from "../../../shared/ui/token/token.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-initiative-details",
  imports: [SplitterComponent, RouterLink, TokenComponent],
  templateUrl: "./initiative-details.component.html",
  styleUrl: "./initiative-details.component.scss",
})
export class InitiativeDetailsComponent implements OnInit {
  initiative: FeedItem | undefined;
  initiativeId: string | null = null;

  constructor(
    private initiativeService: InitiativeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.initiativeId = params["id"];
      this.initiative = this.initiativeService.getInitiative(this.initiativeId);
      if (!this.initiative) {
        // navigating to error page
      }
    });
  }
}
