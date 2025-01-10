import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-splitter",
  imports: [],
  templateUrl: "./splitter.component.html",
  styleUrl: "./splitter.component.scss",
})
export class SplitterComponent {}
