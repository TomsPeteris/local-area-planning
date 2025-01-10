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

export enum InitiativeStatus {
  PROPOSED = "Proposed",
  VOTES_COLLECTED = "VotesCollected",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  FUNDED = "Funded",
  COMPLETED = "Completed",
}
