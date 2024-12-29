import {
  Component,
  signal,
  ChangeDetectionStrategy,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeedItem } from "../../core/models/feed-item.interface";
import { SplitterComponent } from "../../shared/ui/splitter/splitter.component";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TokenComponent } from "../../shared/ui/token/token.component";
import { take, tap } from "rxjs";
import { InitiativeService } from "../../core/services/initiative.service";
import { LoadingOnSubmitDirective } from "../../directives/index";
import { Router } from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-feed",
  templateUrl: "./feed.component.html",
  styleUrls: ["./feed.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TokenComponent,
    SplitterComponent,
    LoadingOnSubmitDirective,
  ],
})
export class FeedComponent implements OnInit {
  initiatives: FeedItem[] = [];

  constructor(
    protected initiativeService: InitiativeService,
    private router: Router
  ) {}

  isLoading = signal(true);

  ngOnInit(): void {
    this.initiativeService
      .getInitiatives()
      .pipe(
        take(1),
        tap(response => {
          this.initiatives = response;
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }

  navigateToDetails(id: string): void {
    this.router.navigate(["initiative/details", id]);
  }
}
