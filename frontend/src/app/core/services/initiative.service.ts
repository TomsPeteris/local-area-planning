import { Injectable } from "@angular/core";
import { Initiative, Proposal } from "../models/initiative.interface";
import { v4 as uuidv4 } from "uuid";

@Injectable({
  providedIn: "root",
})
export class InitiativeService {
  async createInitiative(initiativeForm: {
    title: string;
    description: string;
  }): Promise<Response> {
    return await fetch("/api/initiative", {
      method: "POST",
      body: JSON.stringify({
        InitiativeID: uuidv4(),
        InitiativeTitle: initiativeForm.title,
        InitiativeDescription: initiativeForm.description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async createProposal(
    proposalForm: {
      description: string;
      completionDate: Date;
      costEstimate: number;
    },
    initiativeId: string
  ): Promise<Response> {
    return await fetch(`/api/initiative/${initiativeId}/proposal`, {
      method: "POST",
      body: JSON.stringify({
        ProposalID: uuidv4(),
        Description: proposalForm.description,
        Timeline: proposalForm.completionDate,
        CostEstimate: proposalForm.costEstimate,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getInitiatives(): Promise<Initiative[]> {
    const response = await fetch("/api/initiative");
    return response.json();
  }

  async getMyInitiatives(): Promise<Initiative[]> {
    const response = await fetch("/api/initiative/mine");
    return response.json();
  }

  async followInitiative(initiativeId: string): Promise<boolean> {
    const response = await fetch(`/api/initiative/${initiativeId}/follow`, {
      method: "POST",
    });
    return response.ok;
  }

  async voteForInitiative(initiativeId: string): Promise<Initiative> {
    const response = await fetch(`/api/initiative/${initiativeId}/vote`, {
      method: "POST",
    });
    return response.json();
  }

  async approveInitiative(initiativeId: string): Promise<boolean> {
    const response = await fetch(`/api/initiative/${initiativeId}/approve`, {
      method: "POST",
    });
    return response.ok;
  }

  async getInitiativeById(initiativeId: string): Promise<Initiative> {
    const response = await fetch(`/api/initiative/${initiativeId}`);
    return response.json();
  }

  async getProposalsForInitiative(initiativeId: string): Promise<Proposal[]> {
    const response = await fetch(`/api/initiative/${initiativeId}/proposal`);
    return response.json();
  }

  async getTrackedInitiatives(): Promise<Initiative[]> {
    const response = await fetch(`/api/initiative/followed`);
    return response.json();
  }

  async getInitiativesByStatus(status: string): Promise<Initiative[]> {
    const response = await fetch(`/api/initiative/status/${status}`);
    return response.json();
  }
}
