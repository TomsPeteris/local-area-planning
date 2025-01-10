import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  resource,
  computed,
} from "@angular/core";
import { FeedComponent } from "../../feed/feed.component";
import { InitiativeService } from "../../../core/services/initiative.service";
import { Initiative } from "../../../core/models/initiative.interface";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-my-initiatives",
  imports: [FeedComponent],
  templateUrl: "./my-initiatives.component.html",
  styleUrl: "./my-initiatives.component.scss",
})
export class MyInitiativesComponent {
  private initiativeService = inject(InitiativeService);

  isLoading = signal(true);

  initiativeResource = resource<Initiative[], unknown>({
    loader: async () => {
      const initiatives = await this.initiativeService.getMyInitiatives();
      this.isLoading.set(false);
      return initiatives;
    },
  });

  initiatives = computed(() => this.initiativeResource.value());
}
