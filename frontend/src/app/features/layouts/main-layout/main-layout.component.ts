import { Component } from "@angular/core";
import { SidebarComponent } from "../../dashboard/sidebar/sidebar.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-main-layout",
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"],
})
export class MainLayoutComponent {}
