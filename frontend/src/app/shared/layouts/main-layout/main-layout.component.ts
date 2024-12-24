import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from "../../../features/dashboard/sidebar/sidebar.component";

@Component({
  selector: "app-main-layout",
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"],
})
export class MainLayoutComponent {}
