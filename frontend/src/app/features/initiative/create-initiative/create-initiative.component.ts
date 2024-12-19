import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-initiative",
  imports: [FormsModule, MatInputModule, MatButtonModule, MatFormFieldModule],
  templateUrl: "./create-initiative.component.html",
  styleUrls: ["./create-initiative.component.scss"],
})
export class CreateInitiativeComponent {
  constructor(private router: Router) {}

  onSubmit() {
    // Handle form submission logic here
    // After submission, navigate back to the previous route
    this.router.navigate([".."]); // Adjust the route as necessary
  }

  goBack() {
    this.router.navigate([".."]); // Navigate back to the previous route
  }
}
