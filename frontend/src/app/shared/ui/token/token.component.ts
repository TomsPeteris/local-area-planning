import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-token",
  templateUrl: "./token.component.html",
  styleUrls: ["./token.component.scss"],
})
export class TokenComponent {
  @Input() text = "";
}
