import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
} from "@angular/core";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-timeline",
  imports: [CommonModule],
  templateUrl: "./timeline.component.html",
  styleUrl: "./timeline.component.scss",
})
export class TimelineComponent implements OnChanges {
  private readonly STATUSES = {
    PROPOSED: "Proposed",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    VOTES_COLLECTED: "Votes Collected",
    FUNDED: "Funded",
    COMPLETED: "Completed",
  };
  @Input() status: string = this.STATUSES.PROPOSED;
  currentStep = 0;
  ngOnChanges(): void {
    this.currentStep =
      Object.values(this.STATUSES).indexOf(
        this.status || this.STATUSES.PROPOSED
      ) + 1;
  }
  stepsCount = Object.keys(this.STATUSES).length;
  statutes = Object.values(this.STATUSES);
}
