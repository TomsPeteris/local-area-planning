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
        path: "dashboard",
        loadComponent: () =>
          import("./features/dashboard/dashboard.component").then(
            m => m.DashboardComponent
          ),
      },
      {
        path: "logout",
        canActivate: [logoutGuard],
        loadComponent: () =>
          import(
            "./core/components/authentication/authentication.component"
          ).then(m => m.AuthenticationComponent),
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
