import { Injectable, signal } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { tap } from "rxjs/operators";
import {
  LoginCredentials,
  AuthResponse,
  User,
  DecodedJwtPayload,
} from "../models/user.interface";
import { USERS } from "../data/users";
import { jwtDecode } from "jwt-decode";

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
    this.getUserFromToken()
  );
  private readonly currentUserNameSignal = signal<string | null>(
    this.getUserName()
  );
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly currentUserName = this.currentUserNameSignal.asReadonly();

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const user = USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return throwError(() => new Error("Invalid credentials"));
    }

    const jwtToken = this.generateMockJwtToken(user);

    // Create mock auth response
    const authResponse: AuthResponse = {
      accessToken: jwtToken,
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
      tap(response => {
        localStorage.setItem(this.tokenKey, response.accessToken);
        this.isAuthenticatedSignal.set(true);
        this.currentUserSignal.set(response.user);
        this.currentUserNameSignal.set(this.getUserName());
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

  getUserFromToken(): Omit<User, "password"> | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode<DecodedJwtPayload>(token);
      return {
        id: decoded.id,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role,
      };
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }

  getUserName(): string | null {
    const user = this.getUserFromToken();
    return user ? `${user.firstName} ${user.lastName}` : null;
  }

  private checkInitialAuthState(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const decoded: DecodedJwtPayload = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp > now;
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  }

  private generateMockJwtToken(user: User): string {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const headerBase64 = this.encodeBase64(header);
    const payloadBase64 = this.encodeBase64(payload);

    return `${headerBase64}.${payloadBase64}.mock-signature`;
  }

  private encodeBase64 = (obj: object): string =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
}
