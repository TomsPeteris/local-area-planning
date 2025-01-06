import { User } from "./user.interface";

export interface Initiative {
  id: string;
  title: string;
  description: string;
  goal: string;
  tags: string[];
  createdAt?: Date;
  stage: "published" | "draft";
  author: User;
  phoneNumber: string;
  startDate: string;
  status: InitiativeStatus;
}

export enum InitiativeStatus {
  Submission = "Submission",
  Voting = "Voting",
  ApprovalByLocalAuthorities = "Initial Approval",
  BusinessProposals = "Proposal",
  SecondApproval = "Final Approval",
  Crowdfunding = "Funding",
  Execution = "Verification",
  Disbursement = "Completed",
}
