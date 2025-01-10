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

  async getInitiativeById(initiativeId: string): Promise<Initiative> {
    const request = await fetch(`/api/initiative/${initiativeId}`);
    return await request.json();
  }
}
