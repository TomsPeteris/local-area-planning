import { Routes } from '@angular/router';

export const initiativeRoutes: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./create-initiative/create-initiative.component').then(
        (m) => m.CreateInitiativeComponent
      ),
  },
];
