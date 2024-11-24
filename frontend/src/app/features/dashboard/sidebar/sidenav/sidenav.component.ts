import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class SidenavComponent {
  navItems = [
    { route: "/dashboard", icon: "home", label: "Home" },
    {
      route: "/initiatives",
      icon: "lightbulb_outline",
      label: "My Initiatives",
    },
    { route: "/tracking", icon: "star_outline", label: "Tracking" },
  ];
}
