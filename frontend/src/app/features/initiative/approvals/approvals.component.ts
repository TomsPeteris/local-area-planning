import { Component, computed, inject, resource, signal } from "@angular/core";
import { FeedComponent } from "../../feed/feed.component";
import { SplitterComponent } from "../../../shared/ui/splitter/splitter.component";
import { MatTabsModule } from "@angular/material/tabs";
import { InitiativeService } from "../../../core/services/initiative.service";
import {
  Initiative,
  InitiativeStatus,
} from "../../../core/models/initiative.interface";

@Component({
  selector: "app-approvals",
  imports: [FeedComponent, SplitterComponent, MatTabsModule],
  templateUrl: "./approvals.component.html",
  styleUrls: ["./approvals.component.scss"],
})
export class ApprovalsComponent {
  private initiativeService = inject(InitiativeService);

  isLoading = signal(true);

  pendingInitiativeResource = resource<Initiative[], unknown>({
    loader: async () => {
      const initiatives = await this.initiativeService
        .getInitiatives()
        .then(initiatives =>
          initiatives.filter(
            initiative => initiative.Status === InitiativeStatus.VOTES_COLLECTED
          )
        );
      this.isLoading.set(false);
      return initiatives;
    },
  });

  pendingInitiatives = computed(() => this.pendingInitiativeResource.value());

  pendingProjectResource = resource<Initiative[], unknown>({
    loader: async () => {
      const initiatives = await this.initiativeService.getInitiativesByStatus(
        InitiativeStatus.PROPOSED
      );
      this.isLoading.set(false);
      return initiatives;
    },
  });

  pendingProjects = computed(() => this.pendingProjectResource.value());

  pendingVerificationResource = resource<Initiative[], unknown>({
    loader: async () => {
      const initiatives = await this.initiativeService.getInitiativesByStatus(
        InitiativeStatus.COMPLETED
      );
      this.isLoading.set(false);
      return initiatives;
    },
  });

  pendingVerifications = computed(() =>
    this.pendingVerificationResource.value()
  );
}
