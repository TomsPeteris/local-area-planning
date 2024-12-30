import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-global-error",
  imports: [MatButtonModule, RouterLink],
  templateUrl: "./global-error.component.html",
  styleUrl: "./global-error.component.scss",
})
export class GlobalErrorComponent {}
