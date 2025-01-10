import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  ChangeDetectorRef,
  signal,
  resource,
} from "@angular/core";
import { InitiativeService } from "../../../core/services/initiative.service";
import {
  Initiative,
  InitiativeStatus,
  Proposal,
} from "../../../core/models/initiative.interface";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { SplitterComponent } from "../../../shared/ui/splitter/splitter.component";
import { take } from "rxjs";
import { TimelineComponent } from "../../../shared/ui/timeline/timeline.component";
import { MatButtonModule } from "@angular/material/button";
import { UserService } from "../../user/core/services/user.service";
import { ProposalFeedComponent } from "../proposal-feed/proposal-feed.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-initiative-details",
  standalone: true,
  imports: [
    CommonModule,
    SplitterComponent,
    TimelineComponent,
    MatButtonModule,
    RouterLink,
    ProposalFeedComponent,
  ],
  templateUrl: "./initiative-details.component.html",
  styleUrls: ["./initiative-details.component.scss"],
})
export class InitiativeDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private initiativeService = inject(InitiativeService);
  private cdr = inject(ChangeDetectorRef);
  private userService = inject(UserService);

  currentUser = this.userService.getCurrentUser();
  initiativeId: string | null = null;
  timelineStep: number | null = null;
  initiative: Initiative | undefined;
  proposals: Proposal[] | undefined;
  followed = false;
  date = new Date();
  isLoading = signal(false);

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.initiativeId = params["id"].split(":")[1];
      if (this.initiativeId) {
        this.initiativeService
          .getInitiativeById(this.initiativeId)
          .then((initiative: Initiative) => {
            this.initiative = initiative;
            this.followed = initiative.Followed;
            this.cdr.markForCheck();
          });
        this.initiativeService
          .getProposalsForInitiative(this.initiativeId)
          .then(proposals => {
            this.proposals = proposals;
            this.cdr.markForCheck();
          });
      }
    });
  }

  onFollow(): void {
    this.isLoading.set(true);
    if (this.initiativeId) {
      this.initiativeService
        .followInitiative(this.initiativeId)
        .then(success => {
          if (success) {
            this.followed = true;
            this.isLoading.set(false);
            this.cdr.markForCheck();
          }
        });
    }
  }

  onVote(): void {
    this.isLoading.set(true);
    if (this.initiativeId) {
      this.initiativeService
        .voteForInitiative(this.initiativeId)
        .then(initiative => {
          this.initiative = initiative;
          this.isLoading.set(false);
          this.cdr.markForCheck();
        });
    }
  }

  onApprove(): void {
    this.isLoading.set(true);
    if (this.initiativeId) {
      this.initiativeService.approveInitiative(this.initiativeId).then(() => {
        this.isLoading.set(false);
      });
    }
  }

  isApprovable(): boolean {
    if (
      this.currentUser?.permissions === "authority" &&
      this.initiative?.Status === InitiativeStatus.VOTES_COLLECTED
    ) {
      return true;
    }
    return false;
  }

  isProposable(): boolean {
    if (
      this.currentUser?.permissions === "bussiness" &&
      this.initiative?.Status === InitiativeStatus.APPROVED
    ) {
      return true;
    }
    return false;
  }

  canHaveProposals(): boolean {
    if (
      this.initiative?.Status === InitiativeStatus.PROPOSED ||
      this.initiative?.Status === InitiativeStatus.VOTES_COLLECTED
    ) {
      return false;
    }
    return true;
  }
}
