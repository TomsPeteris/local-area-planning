import { Injectable } from "@angular/core";
import { Initiative } from "../models/initiative.interface";
import { v4 as uuidv4 } from "uuid";

@Injectable({
  providedIn: "root",
})
export class InitiativeService {
  async createInitiative(initiativeForm: Initiative): Promise<Response> {
    return await fetch("/api/initiative", {
      method: "POST",
      body: JSON.stringify({
        InitiativeID: uuidv4(),
        InitiativeTitle: initiativeForm.Title,
        InitiativeDescription: initiativeForm.Description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  getInitiatives(): Promise<Response> {
    return fetch("/api/initiative");
  }

  async followInitiative(initiativeId: string): Promise<boolean> {
    const response = await fetch(`/api/initiative/${initiativeId}/follow`, {
      method: "POST",
    });
    return response.ok;
  }

  async voteForInitiative(initiativeId: string): Promise<Initiative> {
    const response = await fetch(`/api/initiative/${initiativeId}/proposal`);
    return response.json();
  }

  async getInitiativeById(initiativeId: string): Promise<Initiative> {
    const response = await fetch(`/api/initiative/${initiativeId}`);
    return await response.json();
  }

  async getTrackedInitiatives(): Promise<Initiative[]> {
    const response = await fetch(`/api/initiatives/followed`);
    return await response.json();
  }
}
