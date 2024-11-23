import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

export const logoutGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  authService.logout();

  return router.createUrlTree(["/login"], {
    queryParams: { returnUrl: state.url },
  });
};
