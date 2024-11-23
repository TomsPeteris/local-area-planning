import { Injectable, signal } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { delay, tap } from "rxjs/operators";
import { LoginCredentials, AuthResponse, User } from "../models/user.interface";
import { USERS } from "../data/users";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private readonly tokenKey = "auth_token";

  // Using signals for reactive auth state
  private readonly isAuthenticatedSignal = signal<boolean>(
    this.checkInitialAuthState()
  );
  private readonly currentUserSignal = signal<Omit<User, "password"> | null>(
    null
  );
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const user = USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return throwError(() => new Error("Invalid credentials"));
    }

    // Create mock auth response
    const authResponse: AuthResponse = {
      accessToken: `mock-jwt-token-${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      },
    };

    // Simulate network delay
    return of(authResponse).pipe(
      delay(500),
      tap(response => {
        localStorage.setItem(this.tokenKey, response.accessToken);
        this.isAuthenticatedSignal.set(true);
        this.currentUserSignal.set(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSignal.set(false);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private checkInitialAuthState(): boolean {
    return !!this.getToken();
  }
}
