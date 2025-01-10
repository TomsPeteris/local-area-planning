export interface Initiative {
  CurrentVotes: number;
  Description: string;
  ID: string;
  Proposer: string;
  Status: string;
  Title: string;
  VotesRequired: number;
  Followed: boolean;
}

export interface Proposal {
  ID: string;
  InitiativeId: string;
  BusinessId: string;
  CostEstimate: string;
  Timeline: string;
  Description: string;
  Status: "Submitted" | "Approved" | "Rejected";
}

export enum InitiativeStatus {
  PROPOSED = "Proposed",
  VOTES_COLLECTED = "VotesCollected",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  FUNDED = "Funded",
  COMPLETED = "Completed",
}
