import { Injectable, signal } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { LoginCredentials, User } from "../models/user.interface";
import { USERS } from "../data/users";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private readonly userKey = "user";
  private readonly currentUserSignal = signal<User | undefined>(
    this.getCurrentUser()
  );
  private readonly isAuthenticatedSignal = signal<boolean>(
    this.getCurrentUser() ? true : false
  );

  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();

  login(credentials: LoginCredentials): Observable<boolean> {
    const user = USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return throwError(() => new Error("Invalid credentials"));
    }

    localStorage.setItem(this.userKey, JSON.stringify(user));

    this.currentUserSignal.set(user);
    this.isAuthenticatedSignal.set(true);

    return of(true);
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSignal.set(false);
    this.currentUserSignal.set(undefined);
  }

  private getCurrentUser(): User {
    const userItem = localStorage.getItem(this.userKey);
    try {
      const user = userItem ? JSON.parse(userItem) : undefined;
      return user;
    } catch (err) {
      console.error(err);
      localStorage.removeItem(this.userKey);
      throw new Error("Invalid User");
    }
  }
}
