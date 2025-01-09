import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    if (state.url === "/" || state.url.includes("/login")) {
      return router.createUrlTree(["/dashboard"]);
    }
    return true;
  } else {
    return router.createUrlTree(["/login"], {
      queryParams: { returnUrl: state.url },
    });
  }
};
