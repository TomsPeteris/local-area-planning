/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Initiative, Vote, ProjectProposal, Fund, Project, User } from './dataTypes';

@Info({ title: 'LocalAreaPlanning', description: 'A blockchain-based contract for local area planning' })
export class LocalAreaPlanningContract extends Contract {

    // === Initiative Methods ===

    @Transaction(true)
    public async createInitiative(ctx: Context, id: string, title: string, description: string, proposer: string): Promise<Initiative> {
        const initiative = new Initiative();
        initiative.id = id;
        initiative.title = title;
        initiative.description = description;
        initiative.proposer = proposer;

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(initiative)));
        return initiative;
    }

    @Transaction(false)
    @Returns('Initiative')
    public async getInitiative(ctx: Context, id: string): Promise<Initiative> {
        const initiativeData = await ctx.stub.getState(id);
        if (!initiativeData || initiativeData.length === 0) {
            throw new Error(`Initiative with ID ${id} does not exist`);
        }
        return JSON.parse(initiativeData.toString()) as Initiative;
    }

    @Transaction(true)
    public async voteOnInitiative(ctx: Context, initiativeId: string, voterId: string, vote: boolean): Promise<void> {
        const initiative = await this.getInitiative(ctx, initiativeId);
        if (!initiative) {
            throw new Error(`Initiative with ID ${initiativeId} does not exist`);
        }

        if (vote) {
            initiative.votes += 1;
        }

        await ctx.stub.putState(initiativeId, Buffer.from(JSON.stringify(initiative)));
    }

    // === Project Proposal Methods ===

    @Transaction(true)
    public async submitProjectProposal(
        ctx: Context,
        id: string,
        initiativeId: string,
        businessId: string,
        costEstimate: number,
        timeline: string,
        credentials: string[]
    ): Promise<ProjectProposal> {
        const initiative = await this.getInitiative(ctx, initiativeId);
        if (!initiative) {
            throw new Error(`Initiative with ID ${initiativeId} does not exist`);
        }

        const proposal = new ProjectProposal();
        proposal.id = id;
        proposal.initiativeId = initiativeId;
        proposal.businessId = businessId;
        proposal.costEstimate = costEstimate;
        proposal.timeline = timeline;
        // proposal.credentials = credentials;

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(proposal)));
        return proposal;
    }

    @Transaction(false)
    @Returns('ProjectProposal')
    public async getProjectProposal(ctx: Context, id: string): Promise<ProjectProposal> {
        const proposalData = await ctx.stub.getState(id);
        if (!proposalData || proposalData.length === 0) {
            throw new Error(`Project Proposal with ID ${id} does not exist`);
        }
        return JSON.parse(proposalData.toString()) as ProjectProposal;
    }

    // === Crowdfunding Methods ===

    @Transaction(true)
    public async contributeFund(ctx: Context, initiativeId: string, contributorId: string, amount: number): Promise<Fund> {
        const initiative = await this.getInitiative(ctx, initiativeId);
        if (!initiative) {
            throw new Error(`Initiative with ID ${initiativeId} does not exist`);
        }

        const fund = new Fund();
        fund.initiativeId = initiativeId;
        fund.contributorId = contributorId;
        fund.amount = amount;

        const fundKey = `FUND-${Date.now()}`;
        await ctx.stub.putState(fundKey, Buffer.from(JSON.stringify(fund)));
        return fund;
    }

    @Transaction(false)
    @Returns('Fund[]')
    public async getFundsByInitiative(ctx: Context, initiativeId: string): Promise<Fund[]> {
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
    public async startProject(ctx: Context, id: string, initiativeId: string): Promise<Project> {
        const initiative = await this.getInitiative(ctx, initiativeId);
        if (!initiative) {
            throw new Error(`Initiative with ID ${initiativeId} does not exist`);
        }

        const project = new Project();
        project.id = id;
        project.initiativeId = initiativeId;

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(project)));
        return project;
    }

    @Transaction(true)
    public async updateProjectStatus(ctx: Context, projectId: string, update: string): Promise<void> {
        const projectData = await ctx.stub.getState(projectId);
        if (!projectData || projectData.length === 0) {
            throw new Error(`Project with ID ${projectId} does not exist`);
        }

        const project = JSON.parse(projectData.toString()) as Project;
        // project.progressUpdates.push(update);

        await ctx.stub.putState(projectId, Buffer.from(JSON.stringify(project)));
    }

    @Transaction(true)
    public async completeProject(ctx: Context, projectId: string): Promise<void> {
        const project = await this.getProject(ctx, projectId);
        if (!project) {
            throw new Error(`Project with ID ${projectId} does not exist`);
        }

        project.status = 'Completed';
        await ctx.stub.putState(projectId, Buffer.from(JSON.stringify(project)));
    }

    @Transaction(false)
    @Returns('Project')
    public async getProject(ctx: Context, id: string): Promise<Project> {
        const projectData = await ctx.stub.getState(id);
        if (!projectData || projectData.length === 0) {
            throw new Error(`Project with ID ${id} does not exist`);
        }
        return JSON.parse(projectData.toString()) as Project;
    }
}
