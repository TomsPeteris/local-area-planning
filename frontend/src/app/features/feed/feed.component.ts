import {
  Component,
  signal,
  ChangeDetectionStrategy,
  OnInit,
  Input,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Initiative } from "../../core/models/initiative.interface";
import { SplitterComponent } from "../../shared/ui/splitter/splitter.component";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TokenComponent } from "../../shared/ui/token/token.component";
import { take, tap } from "rxjs";
import { InitiativeService } from "../../core/services/initiative.service";
import { LoadingOnSubmitDirective } from "../../directives/index";
import { RouterLink } from "@angular/router";

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
    RouterLink,
  ],
})
export class FeedComponent implements OnInit {
  @Input() pageTitle = "";
  @Input() userId: string | undefined = undefined;
  initiatives: Initiative[] = [];

  constructor(protected initiativeService: InitiativeService) {}

  isLoading = signal(true);

  ngOnInit(): void {
    this.initiativeService
      .getInitiatives(this.userId)
      .pipe(
        take(1),
        tap(response => {
          this.initiatives = response;
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }
}
