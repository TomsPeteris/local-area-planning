import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (state.url.includes("/login")) {
    if (authService.isAuthenticated()) {
      return router.createUrlTree(["/dashboard"]);
    }
    return true;
  }

  if (state.url === "/") {
    if (authService.isAuthenticated()) {
      return router.createUrlTree(["/dashboard"]);
    }
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(["/login"], {
    queryParams: { returnUrl: state.url },
  });
};
