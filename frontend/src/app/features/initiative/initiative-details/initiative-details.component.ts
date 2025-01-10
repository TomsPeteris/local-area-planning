import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  ChangeDetectorRef,
} from "@angular/core";
import { InitiativeService } from "../../../core/services/initiative.service";
import { Initiative } from "../../../core/models/initiative.interface";
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
  styleUrls: ["./initiative-details.component.scss"],
})
export class InitiativeDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private initiativeService = inject(InitiativeService);
  private cdr = inject(ChangeDetectorRef);

  initiativeId: string | null = null;
  timelineStep: number | null = null;
  initiative: Initiative | undefined;
  date = new Date();

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.initiativeId = params["id"];
      if (this.initiativeId) {
        this.initiativeService
          .getInitiativeById(this.initiativeId)
          .then((initiative: Initiative) => {
            this.initiative = initiative;
            this.cdr.markForCheck();
          });
      }
    });
  }
}
