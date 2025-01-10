import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
} from "@angular/core";
import { InitiativeStatus } from "../../../core/models/initiative.interface";

@Component({
  selector: "app-timeline",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./timeline.component.html",
  styleUrls: ["./timeline.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnChanges {
  private readonly STATUSES: Record<InitiativeStatus, string> = {
    [InitiativeStatus.PROPOSED]: "Proposed",
    [InitiativeStatus.VOTES_COLLECTED]: "Votes Collected",
    [InitiativeStatus.APPROVED]: "Approved / Rejected",
    [InitiativeStatus.REJECTED]: "Approved / Rejected",
    [InitiativeStatus.FUNDED]: "Funded",
    [InitiativeStatus.COMPLETED]: "Completed",
  };

  steps = [
    "Proposed",
    "Votes Collected",
    "Approved / Rejected",
    "Funded",
    "Completed",
  ];

  @Input() status: InitiativeStatus | string = InitiativeStatus.PROPOSED;

  currentStep = 0;

  ngOnChanges(): void {
    const enumValues = Object.values(InitiativeStatus);
    const finalStatus = enumValues.includes(this.status as InitiativeStatus)
      ? (this.status as InitiativeStatus)
      : InitiativeStatus.PROPOSED;

    const label = this.STATUSES[finalStatus];

    this.currentStep = this.steps.indexOf(label) + 1;
  }
}
