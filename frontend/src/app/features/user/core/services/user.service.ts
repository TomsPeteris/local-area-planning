import { Injectable, inject } from "@angular/core";
import { AuthenticationService } from "../../../../core/services/authentication.service";
import { User } from "../../../../core/models/user.interface";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly authService = inject(AuthenticationService);

  getCurrentUser(): Omit<User, "password"> | undefined {
    return this.authService.currentUser();
  }
}
