import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { UserService } from "../../../user/core/services/user.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
})
export class SidenavComponent {
  private userService = inject(UserService);

  currentUser = this.userService.getCurrentUser();

  navItems = [
    { route: "/dashboard", icon: "home", label: "Home", permissions: "" },
    {
      route: "/initiative/my-initiatives",
      icon: "lightbulb_outline",
      label: "My Initiatives",
      permissions: "",
    },
    {
      route: "/initiative/tracked",
      icon: "star_outline",
      label: "Tracking",
      permissions: "",
    },
    {
      route: "/initiative/approvals",
      icon: "pending",
      label: "Pending Approvals",
      permissions: "authority",
    },
  ];
}
