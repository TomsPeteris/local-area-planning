import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
} from "@angular/core";
import { FeedComponent } from "../feed/feed.component";
import { InitiativeService } from "../../core/services/initiative.service";
import { Initiative } from "../../core/models/initiative.interface";
import { take, tap } from "rxjs";
import { LoadingOnSubmitDirective } from "../../directives";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  standalone: true,
  imports: [FeedComponent, LoadingOnSubmitDirective],
})
export class DashboardComponent implements OnInit {
  private readonly initiativeService = inject(InitiativeService);
  isLoading = signal(true);
  initiatives = signal<Initiative[]>([]);

  ngOnInit(): void {
    this.initiativeService
      .getInitiatives()
      .pipe(
        take(1),
        tap(response => {
          this.initiatives.set(response);
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }
}
