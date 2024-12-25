import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { logoutGuard } from "./core/guards/logout.guard";
import { initiativeRoutes } from "./features/initiative/initiative.routes";
import { MainLayoutComponent } from "./shared/layouts/main-layout/main-layout.component";

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./core/components/authentication/authentication.component').then(
        (m) => m.AuthenticationComponent
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'initiative',
        children: [...initiativeRoutes],
      },
      {
        path: 'logout',
        canActivate: [logoutGuard],
        loadComponent: () =>
          import(
            './core/components/authentication/authentication.component'
          ).then((m) => m.AuthenticationComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./core/components/not-found/not-found.component').then(
            (m) => m.NotFoundComponent
          ),
      },
    ],
  },
];
