import { Injectable, inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { User } from "../models/user.interface";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly authService = inject(AuthenticationService);

  getCurrentUser(): Observable<Omit<User, "password"> | null> {
    return of(this.authService.currentUser());
  }
}
