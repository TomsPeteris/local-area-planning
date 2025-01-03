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
  Submission = "Initiative Submission",
  Voting = "Community Voting",
  ApprovalByLocalAuthorities = "Approval Process by Local Authorities",
  BusinessProposals = "Project Proposals from Businesses",
  SecondApproval = "Second Approval Process by Local Authorities",
  Crowdfunding = "Crowdfunding Stage",
  Execution = "Project Execution and Verification",
  Disbursement = "Disbursement of Funds",
}
