import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-loading-spinner",
  imports: [MatProgressSpinnerModule],
  templateUrl: "./loading-spinner.component.html",
  styleUrl: "./loading-spinner.component.scss",
})
export class LoadingSpinnerComponent {
  @Input() isLoading = false;
}
