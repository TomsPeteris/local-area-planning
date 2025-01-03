import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { InitiativeService } from "../../../core/services/initiative.service";
import {
  Initiative,
  InitiativeStatus,
} from "../../../core/models/initiative.interface";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { SplitterComponent } from "../../../shared/ui/splitter/splitter.component";
import { take } from "rxjs";
import { TimelineComponent } from "../../../shared/ui/timeline/timeline.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-initiative-details",
  standalone: true,
  imports: [CommonModule, SplitterComponent, RouterLink, TimelineComponent],
  templateUrl: "./initiative-details.component.html",
  styleUrl: "./initiative-details.component.scss",
})
export class InitiativeDetailsComponent implements OnInit {
  initiative: Initiative | undefined;
  initiativeId: string | null = null;
  timelineStep: number | null = null;

  constructor(
    private initiativeService: InitiativeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.initiativeId = params["id"];
      if (this.initiativeId) {
        this.initiative = this.initiativeService.getInitiativeById(
          this.initiativeId
        );
        this.timelineStep =
          Object.values(InitiativeStatus).indexOf(
            this.initiative?.status || InitiativeStatus.Submission
          ) + 1;

        if (!this.initiative) {
          //navigate to error page
        }
      }
    });
  }
}
