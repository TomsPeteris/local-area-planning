import { Component } from "@angular/core";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { AccountComponent } from "../../account/account.component";

@Component({
  selector: "app-sidebar",
  imports: [SidenavComponent, AccountComponent],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {}
