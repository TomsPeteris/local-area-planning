import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { take } from "rxjs";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-authentication",
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./authentication.component.html",
  styleUrl: "./authentication.component.scss",
})
export class AuthenticationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthenticationService);

  loginForm: FormGroup = this.fb.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required]],
  });

  isLoading = false;
  hidePassword = true;

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        this.authService
          .login(this.loginForm.value)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.router.navigate(["/dashboard"]);
            },
          });
      } catch (error) {
        console.error("Login error:", error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
