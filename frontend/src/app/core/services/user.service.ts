import { Injectable, inject } from "@angular/core";
import { User } from "../models/user.interface";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly authService = inject(AuthenticationService);

  getCurrentUser(): Omit<User, "password"> | null {
    return this.authService.currentUser();
  }
}
