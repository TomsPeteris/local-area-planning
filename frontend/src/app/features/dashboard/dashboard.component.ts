import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  resource,
  computed,
} from "@angular/core";
import { FeedComponent } from "../feed/feed.component";
import { Initiative } from "../../core/models/initiative.interface";
import { InitiativeService } from "../../core/services/initiative.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  standalone: true,
  imports: [FeedComponent],
})
export class DashboardComponent {
  private initiativeService = inject(InitiativeService);

  isLoading = signal(true);

  initiativeResource = resource<Initiative[], unknown>({
    loader: async () => {
      const initiatives = await this.initiativeService.getInitiatives();
      this.isLoading.set(false);
      return initiatives;
    },
  });

  initiatives = computed(() => this.initiativeResource.value());
}
