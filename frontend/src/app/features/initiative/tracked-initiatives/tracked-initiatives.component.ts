import { Component, computed, resource, inject, signal } from "@angular/core";
import { FeedComponent } from "../../feed/feed.component";
import { InitiativeService } from "../../../core/services/initiative.service";
import { Initiative } from "../../../core/models/initiative.interface";

@Component({
  selector: "app-tracked-initiatives",
  imports: [FeedComponent],
  templateUrl: "./tracked-initiatives.component.html",
  styleUrls: ["./tracked-initiatives.component.scss"],
})
export class TrackedInitiativesComponent {
  private initiativeService = inject(InitiativeService);

  isLoading = signal(true);

  initiativeResource = resource<Initiative[], unknown>({
    loader: async () => {
      const initiatives = await this.initiativeService.getTrackedInitiatives();
      this.isLoading.set(false);
      return initiatives;
    },
  });

  initiatives = computed(() => this.initiativeResource.value());
}
