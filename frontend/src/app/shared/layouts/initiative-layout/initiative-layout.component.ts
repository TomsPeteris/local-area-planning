import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-initiative-layout",
  imports: [RouterOutlet],
  templateUrl: "./initiative-layout.component.html",
  styleUrl: "./initiative-layout.component.scss",
})
export class InitiativeLayoutComponent {}
