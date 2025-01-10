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
  {
    path: "approvals",
    loadComponent: () =>
      import("./approvals/approvals.component").then(m => m.ApprovalsComponent),
  },
  {
    path: "details/:id/proposal/create",
    loadComponent: () =>
      import("./create-proposal/create-proposal.component").then(
        m => m.CreateProposalComponent
      ),
  },
];
