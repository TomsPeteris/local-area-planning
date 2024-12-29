import { CommonModule, DatePipe } from "@angular/common";
import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { InitiativeService } from "../../../core/services/initiative.service";
import { Initiative } from "../../../core/models/initiative.interface";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { SplitterComponent } from "../../../shared/ui/splitter/splitter.component";
import { TokenComponent } from "../../../shared/ui/token/token.component";
import { take } from "rxjs";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-initiative-details",
  standalone: true,
  imports: [
    CommonModule,
    SplitterComponent,
    RouterLink,
    TokenComponent,
    DatePipe,
  ],
  templateUrl: "./initiative-details.component.html",
  styleUrl: "./initiative-details.component.scss",
})
export class InitiativeDetailsComponent implements OnInit {
  initiative: Initiative | undefined;
  initiativeId: string | null = null;
  startedDateFormated = "";
  createdDateFormated = "";

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
        if (!this.initiative) {
          //navigate to error page
        }
      }
    });
  }
}
