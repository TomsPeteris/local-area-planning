import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
} from "@angular/core";
import { InitiativeStatus } from "../../../core/models/initiative.interface";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-timeline",
  imports: [CommonModule],
  templateUrl: "./timeline.component.html",
  styleUrl: "./timeline.component.scss",
})
export class TimelineComponent implements OnChanges {
  @Input() status: InitiativeStatus = InitiativeStatus.Submission;
  currentStep = 0;
  ngOnChanges(): void {
    this.currentStep =
      Object.values(InitiativeStatus).indexOf(
        this.status || InitiativeStatus.Submission
      ) + 1;
  }
  stepsCount = Object.keys(InitiativeStatus).length;
  statutes = Object.values(InitiativeStatus);
}
