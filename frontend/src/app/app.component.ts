import { Component } from "@angular/core";
import { AuthenticationService } from "./core/services/authentication.service";
import { RouterOutlet } from "@angular/router";
import { MainLayoutComponent } from "./shared/layouts/main-layout/main-layout.component";

@Component({
  selector: "app-root",
  imports: [MainLayoutComponent, RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "frontend";
  isAuthenticated$;

  constructor(private authService: AuthenticationService) {
    this.isAuthenticated$ = this.authService.isAuthenticated;
  }
}
