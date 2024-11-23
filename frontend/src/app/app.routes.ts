import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { logoutGuard } from "./core/guards/logout.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./core/components/authentication/authentication.component").then(
        m => m.AuthenticationComponent
      ),
  },
  {
    path: "",
    canActivate: [authGuard],
    children: [
      {
        path: "logout",
        canActivate: [logoutGuard],
        loadComponent: () =>
          import(
            "./core/components/authentication/authentication.component"
          ).then(m => m.AuthenticationComponent),
      },
      {
        path: "dashboard",
        loadComponent: () =>
          import("./core/components/dashboard/dashboard.component").then(
            m => m.DashboardComponent
          ),
      },
      {
        path: "**",
        loadComponent: () =>
          import("./core/components/not-found/not-found.component").then(
            m => m.NotFoundComponent
          ),
      },
    ],
  },
];
