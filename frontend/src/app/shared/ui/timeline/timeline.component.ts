import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { InitiativeStatus } from "../../../core/models/initiative.interface";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-timeline",
  imports: [CommonModule],
  templateUrl: "./timeline.component.html",
  styleUrl: "./timeline.component.scss",
})
export class TimelineComponent {
  @Input() status: InitiativeStatus = InitiativeStatus.Submission;
  @Input() currentStep = 1;
  allSteps = Object.keys(InitiativeStatus).length;
  allStatutes = Object.values(InitiativeStatus);
}
