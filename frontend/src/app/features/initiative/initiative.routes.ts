import { Routes } from "@angular/router";

export const initiativeRoutes: Routes = [
  {
    path: "create",
    loadComponent: () =>
      import("./create-initiative/create-initiative.component").then(
        m => m.CreateInitiativeComponent
      ),
  },
  {
    path: "details/:id",
    loadComponent: () =>
      import("./initiative-details/initiative-details.component").then(
        m => m.InitiativeDetailsComponent
      ),
  },
  {
    path: "my-initiatives",
    loadComponent: () =>
      import("./my-initiatives/my-initiatives.component").then(
        m => m.MyInitiativesComponent
      ),
  },
  {
    path: "tracked",
    loadComponent: () =>
      import("./tracked-initiatives/tracked-initiatives.component").then(
        m => m.TrackedInitiativesComponent
      ),
  },
];
