import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { AuthenticationService } from "../../core/services/authentication.service";
import { UserNamePipe } from "../../shared/pipes";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    NgOptimizedImage,
    UserNamePipe,
  ],
})
export class AccountComponent implements AfterViewInit {
  private readonly authService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private elementRef = inject(ElementRef);

  user = this.authService.currentUser();

  ngAfterViewInit(): void {
    // Get the trigger element width and set it as a CSS variable
    const triggerElement =
      this.elementRef.nativeElement.querySelector(".account-button");
    if (triggerElement) {
      const width = triggerElement.offsetWidth;
      document.documentElement.style.setProperty(
        "--trigger-width",
        `${width}px`
      );
    }
  }

  logout(): void {
    this.router.navigate(["/logout"]);
  }
}
