import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FeedComponent } from "../feed/feed.component";
import { UserService } from "../../core/services/user.service";
import { InitiativeService } from "../../core/services/initiative.service";
import { take, tap } from "rxjs";
import { Initiative } from "../../core/models/initiative.interface";
import { LoadingOnSubmitDirective } from "../../directives";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-my-initiatives",
  imports: [FeedComponent, LoadingOnSubmitDirective],
  templateUrl: "./my-initiatives.component.html",
  styleUrl: "./my-initiatives.component.scss",
})
export class MyInitiativesComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly initiativeService = inject(InitiativeService);
  isLoading = signal(true);
  userInitiatives = signal<Initiative[]>([]);

  ngOnInit(): void {
    const currentUserId: string = this.userService.getCurrentUser()?.id || "";

    this.initiativeService
      .getInitiativesByUserId(currentUserId)
      .pipe(
        take(1),
        tap(response => {
          this.userInitiatives.set(response);
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }
}
