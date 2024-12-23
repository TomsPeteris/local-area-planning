import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginCredentials, AuthResponse, User } from '../models/user.interface';
import { USERS } from '../data/users';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'user';

  // Using signals for reactive auth state
  private readonly isAuthenticatedSignal = signal<boolean>(
    this.checkInitialAuthState()
  );
  private readonly currentUserSignal = signal<Omit<User, 'password'> | null>(
    null
  );
  private readonly currentUserNameSignal = signal<string | null>(
    this.getUser()
  );
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly currentUserName = this.currentUserNameSignal.asReadonly();

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const user = USERS.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return throwError(() => new Error('Invalid credentials'));
    }

    // Create mock auth response
    const authResponse: AuthResponse = {
      accessToken: `mock-jwt-token-${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };

    // Simulate network delay
    return of(authResponse).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.accessToken);
        localStorage.setItem(
          this.userKey,
          `${response.user.firstName} ${response.user.lastName}`
        );
        this.isAuthenticatedSignal.set(true);
        this.currentUserSignal.set(response.user);
        this.currentUserNameSignal.set(this.getUser());
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSignal.set(false);
    this.currentUserSignal.set(null);
  }

  getUser(): string | null {
    return localStorage.getItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private checkInitialAuthState(): boolean {
    return !!this.getToken();
  }
}
