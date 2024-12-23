import { Component } from "@angular/core";
import { MainLayoutComponent } from "./features/layouts/main-layout/main-layout.component";

@Component({
  selector: "app-root",
  imports: [MainLayoutComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "frontend";
}
