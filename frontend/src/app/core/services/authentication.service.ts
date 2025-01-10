import { inject, Injectable, Injector, signal } from "@angular/core";
import { catchError, Observable, of, take, tap, throwError } from "rxjs";
import { LoginCredentials, User } from "../models/user.interface";
import { USERS } from "../data/users";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private injector = inject(Injector);

  private readonly userKey = "user";
  private readonly currentUserSignal = signal<User | undefined>(
    this.getCurrentUser()
  );
  private readonly isAuthenticatedSignal = signal<boolean>(
    this.getCurrentUser() ? true : false
  );

  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();

  login(credentials: LoginCredentials): Observable<any> {
    const http = this.injector.get(HttpClient);
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return http
      .post<any>("/api/login", credentials, {
        headers,
        withCredentials: true,
      })
      .pipe(
        tap(response => {
          console.log(response);
          localStorage.setItem(this.userKey, JSON.stringify(response));

          this.currentUserSignal.set(response);
          this.isAuthenticatedSignal.set(true);
        }),
        catchError(() => {
          return throwError(() => new Error("Invalid credentials"));
        })
      );
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
