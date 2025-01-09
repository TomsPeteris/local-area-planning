/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { Initiative, Vote, ProjectProposal, Fund, Project, User } from './dataTypes';

@Info({ title: 'LocalAreaPlanning', description: 'A blockchain-based contract for local area planning' })
export class LocalAreaPlanningContract extends Contract {

    // === Initiative Methods ===
    // CreateInitiative issues a new initiative to the world state with given details.
    @Transaction()
    public async CreateInitiative(ctx: Context, id: string, title: string, description: string, proposer: string): Promise<void> {
        const exists = await this.InitiativeExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }
        const initiative = new Initiative();
        initiative.ID = id;
        initiative.Title = title;
        initiative.Description = description;
        initiative.Proposer = proposer;

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(initiative)));
    }

    // ReadInitiative returns the initiative stored in the world state with given id.
    @Transaction(false)
    public async ReadInitiative(ctx: Context, id: string): Promise<string> {
        const initiativeData = await ctx.stub.getState(id);
        if (initiativeData.length === 0) {
            throw new Error(`Initiative with ID ${id} does not exist`);
        }
        return initiativeData.toString();
    }

    // UpdateInitiative updates a given initiative with the given properties.
    @Transaction()
    public async UpdateInitiative(ctx: Context, id: string, property: string, newValue: string): Promise<void> {
        const initiativeString = await this.ReadInitiative(ctx, id);
        if (initiativeString.length === 0) {
            throw new Error(`Initiative with ID ${id} does not exist`);
        }
        const initiative = JSON.parse(initiativeString) as Initiative;

        if (!(property in initiative)) {
            throw new Error(`Property ${property} does not exist on Initiative`);
        }
        // overwriting original value with new value
        (initiative as any)[property] = newValue;
        
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(initiative))));
    }

    // DeleteInitiative deletes a given initiative from the world state.
    @Transaction()
    public async DeleteInitiative(ctx: Context, id: string): Promise<void> {
        const exists = await this.InitiativeExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // InitiativeExists returns true when initiative with given ID exists in world state.
    @Transaction(false)
    @Returns('boolean')
    public async InitiativeExists(ctx: Context, id: string): Promise<boolean> {
        const initiativeJSON = await ctx.stub.getState(id);
        return initiativeJSON.length > 0;
    }

    // VoteOnInitiative adds a vote to a initiative with given ID.
    @Transaction()
    public async VoteOnInitiative(ctx: Context, id: string): Promise<void> {
        const initiativeString = await this.ReadInitiative(ctx, id);
        if (initiativeString.length === 0) {
            throw new Error(`Initiative with ID ${id} does not exist`);
        }
        const initiative = JSON.parse(initiativeString) as Initiative;
        initiative.CurrentVotes += 1;
        if(initiative.CurrentVotes >= initiative.VotesRequired){
            initiative.Status = 'Votes Collected'
        }

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(initiative))));
    }

    // GetAllInitiatives returns all initiatives found in the world state.
    @Transaction(false)
    @Returns('string')
    public async GetAllInitiatives(ctx: Context): Promise<string> {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all initiatives in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue) as Initiative;
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }








    // === Project Proposal Methods ===

    @Transaction(true)
    public async SubmitProjectProposal(
        ctx: Context,
        id: string,
        initiativeId: string,
        businessId: string,
        costEstimate: number,
        timeline: string,
        //credentials: string[]
    ): Promise<ProjectProposal> {
        const initiative = await this.ReadInitiative(ctx, initiativeId);
        if (!initiative) {
            throw new Error(`Initiative with ID ${initiativeId} does not exist`);
        }

        const proposal = new ProjectProposal();
        proposal.ID = id;
        proposal.InitiativeId = initiativeId;
        proposal.BusinessId = businessId;
        proposal.CostEstimate = costEstimate;
        proposal.Timeline = timeline;
        // proposal.credentials = credentials;

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(proposal)));
        return proposal;
    }

    @Transaction(false)
    @Returns('ProjectProposal')
    public async GetProjectProposal(ctx: Context, id: string): Promise<ProjectProposal> {
        const proposalData = await ctx.stub.getState(id);
        if (!proposalData || proposalData.length === 0) {
            throw new Error(`Project Proposal with ID ${id} does not exist`);
        }
        return JSON.parse(proposalData.toString()) as ProjectProposal;
    }

    // === Crowdfunding Methods ===

    @Transaction(true)
    public async ContributeFund(ctx: Context, initiativeId: string, contributorId: string, amount: number): Promise<Fund> {
        const initiative = await this.ReadInitiative(ctx, initiativeId);
        if (!initiative) {
            throw new Error(`Initiative with ID ${initiativeId} does not exist`);
        }

        const fund = new Fund();
        fund.InitiativeId = initiativeId;
        fund.ContributorId = contributorId;
        fund.Amount = amount;

        const fundKey = `FUND-${Date.now()}`;
        await ctx.stub.putState(fundKey, Buffer.from(JSON.stringify(fund)));
        return fund;
    }

    @Transaction(false)
    @Returns('Fund[]')
    public async GetFundsByInitiative(ctx: Context, initiativeId: string): Promise<Fund[]> {
        const query = { selector: { initiativeId } };
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        const funds: Fund[] = [];

        while (true) {
            const result = await iterator.next();
            if (result.done) break;

            const fund = JSON.parse(result.value.value.toString()) as Fund;
            funds.push(fund);
        }

        return funds;
    }

    // === Project Management Methods ===

    @Transaction(true)
    public async StartProject(ctx: Context, id: string, initiativeId: string): Promise<Project> {
        const initiative = await this.ReadInitiative(ctx, initiativeId);
        if (!initiative) {
            throw new Error(`Initiative with ID ${initiativeId} does not exist`);
        }

        const project = new Project();
        project.ID = id;
        project.InitiativeId = initiativeId;

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(project)));
        return project;
    }

    @Transaction(true)
    public async UpdateProjectStatus(ctx: Context, projectId: string, update: string): Promise<void> {
        const projectData = await ctx.stub.getState(projectId);
        if (!projectData || projectData.length === 0) {
            throw new Error(`Project with ID ${projectId} does not exist`);
        }

        const project = JSON.parse(projectData.toString()) as Project;
        // project.progressUpdates.push(update);

        await ctx.stub.putState(projectId, Buffer.from(JSON.stringify(project)));
    }

    @Transaction(true)
    public async CompleteProject(ctx: Context, projectId: string): Promise<void> {
        const project = await this.GetProject(ctx, projectId);
        if (!project) {
            throw new Error(`Project with ID ${projectId} does not exist`);
        }

        project.Status = 'Completed';
        await ctx.stub.putState(projectId, Buffer.from(JSON.stringify(project)));
    }

    @Transaction(false)
    @Returns('Project')
    public async GetProject(ctx: Context, id: string): Promise<Project> {
        const projectData = await ctx.stub.getState(id);
        if (!projectData || projectData.length === 0) {
            throw new Error(`Project with ID ${id} does not exist`);
        }
        return JSON.parse(projectData.toString()) as Project;
    }
}
