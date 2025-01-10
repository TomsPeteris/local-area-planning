import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-base-layout",
  imports: [RouterOutlet],
  templateUrl: "./base-layout.component.html",
  styleUrl: "./base-layout.component.scss",
})
export class BaseLayoutComponent {}
