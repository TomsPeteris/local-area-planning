import { Component, ChangeDetectionStrategy } from "@angular/core";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { AccountComponent } from "../../account/account.component";
import { SplitterComponent } from "../../../shared/ui/splitter/splitter.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-sidebar",
  imports: [
    SidenavComponent,
    AccountComponent,
    SplitterComponent,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {}
