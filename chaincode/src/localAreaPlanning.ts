/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { Initiative, Vote, Proposal, Fund } from './dataTypes';
import { Iterators } from 'fabric-shim';

@Info({ title: 'LocalAreaPlanning', description: 'A blockchain-based contract for local area planning' })
export class LocalAreaPlanningContract extends Contract {

    // === Initiative Methods ===
    // CreateInitiative issues a new initiative to the world state with given details.
    @Transaction()
    public async CreateInitiative(ctx: Context, id: string, title: string, description: string, proposer: string): Promise<Initiative> {
        const exists = await this.EntryExists(ctx, `Initiative:${id}`);
        if (exists) {
            throw new Error(`The initiative ${id} already exists`);
        }
        const initiative = new Initiative();
        initiative.ID = `Initiative:${id}`;
        initiative.Title = title;
        initiative.Description = description;
        initiative.Proposer = proposer;

        await ctx.stub.putState(initiative.ID, Buffer.from(JSON.stringify(initiative)));
        return initiative;
    }

    // GetInitiative returns initiative found in the world state with the given ID.
    @Transaction(false)
    public async GetInitiative(ctx: Context, id: string): Promise<Initiative> {
        return JSON.parse(await this.ReadEntry(ctx, `Initiative:${id}`)) as Initiative;
    }

    // UpdateInitiative updates a given initiative with the given properties.
    @Transaction()
    public async UpdateInitiative(ctx: Context, id: string, property: string, newValue: string): Promise<Initiative> {
        const initiativeString = await this.ReadEntry(ctx, `Initiative:${id}`);
        if (initiativeString.length === 0) {
            throw new Error(`Initiative with ID ${id} does not exist`);
        }
        const initiative = JSON.parse(initiativeString) as Initiative;

        if (!(property in initiative)) {
            throw new Error(`Property ${property} does not exist on Initiative`);
        }
        // overwriting original value with new value
        (initiative as any)[property] = newValue;
        
        await ctx.stub.putState(initiative.ID, Buffer.from(stringify(sortKeysRecursive(initiative))));
        return initiative;
    }

    // GetAllInitiatives returns all initiatives found in the world state.
    @Transaction(false)
    public async GetAllInitiatives(ctx: Context): Promise<Initiative[]> {
        const startKey = 'Initiative:';
        const endKey = 'Initiative:~'; // '~' is a high ASCII character to include all keys with this prefix

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const results = await this.getAllResults(iterator);

        return results as Initiative[];
    }

    // VoteOnInitiative adds a vote to a initiative with given ID.
    @Transaction()
    public async VoteOnInitiative(ctx: Context, id: string, userID: string): Promise<Initiative> {
        const initiativeString = await this.ReadEntry(ctx, `Initiative:${id}`);
        if (initiativeString.length === 0) {
            throw new Error(`Initiative with ID ${id} does not exist`);
        }
        const initiative = JSON.parse(initiativeString) as Initiative;
        initiative.CurrentVotes += 1;
        if(initiative.CurrentVotes >= initiative.VotesRequired){
            initiative.Status = 'VotesCollected'
        }
        // const vote = new Vote();
        // vote.VoteId = `Vote:${userID +initiative.ID}`;
        // vote.InitiativeId = initiative.ID;
        // vote.VoterId = userID;
        // vote.Vote = true;

        await ctx.stub.putState(initiative.ID, Buffer.from(stringify(sortKeysRecursive(initiative))));
        //await ctx.stub.putState(vote.VoteId, Buffer.from(stringify(sortKeysRecursive(vote))));
        return initiative;
    }


    // === Generic Blockchain Methods ===

    // ReadEntry returns the entry stored in the world state with given id.
    @Transaction(false)
    private async ReadEntry(ctx: Context, id: string): Promise<string> {
        const entryData = await ctx.stub.getState(id);
        if (entryData.length === 0) {
            throw new Error(`Entry with ID ${id} does not exist`);
        }
        return entryData.toString();
    }

    // DeleteEntry deletes a given entry from the world state.
    @Transaction()
    private async DeleteEntry(ctx: Context, id: string): Promise<void> {
        const exists = await this.EntryExists(ctx, id);
        if (!exists) {
            throw new Error(`The entry ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // EntryExists returns true when entry with given ID exists in world state.
    @Transaction(false)
    @Returns('boolean')
    private async EntryExists(ctx: Context, id: string): Promise<boolean> {
        const entryJSON = await ctx.stub.getState(id);
        return entryJSON.length > 0;
    }

    private async getAllResults(iterator: Iterators.StateQueryIterator): Promise<any[]> {
        const allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                const record = JSON.parse(res.value.value.toString());
                allResults.push(record);
            }
            res = await iterator.next();
        }
        await iterator.close();
        return allResults;
    }

    // GetEntryHistory returns the whole history from the ledger for the specified ID.
    @Transaction(false)
    public async GetEntryHistory(ctx: Context, id: string): Promise<any[]> {
        const iterator = await ctx.stub.getHistoryForKey(id);
        const results = [];

        let res = await iterator.next();
        while (!res.done) {
            if (res.value) {
                const record = {
                    txId: res.value.txId, // Transaction ID
                    timestamp: res.value.timestamp, // Time of the transaction
                    isDelete: res.value.isDelete, // Whether this entry represents a deletion
                    value: res.value.value.toString() ? JSON.parse(res.value.value.toString()) : null,
                };
                results.push(record);
            }
            res = await iterator.next();
        }
        await iterator.close();

        return results;
    }




    // === Project Proposal Methods ===

    @Transaction()
    public async CreateProposal(
        ctx: Context,
        id: string,
        initiativeId: string,
        businessId: string,
        costEstimate: string,
        timeline: string,
        description: string,
    ): Promise<Proposal> {
        const initiativeExists = await this.EntryExists(ctx, `Initiative:${initiativeId}`);
        if (!initiativeExists) {
            throw new Error(`Initiative with ID ${initiativeId} does not exist`);
        }
        const proposalExists = await this.EntryExists(ctx, `Proposal:${id}`);
        if (proposalExists) {
            throw new Error(`Proposal with ID ${initiativeId} already exists`);
        }

        const proposal = new Proposal();
        proposal.ID = `Proposal:${id}`;
        proposal.InitiativeId = initiativeId;
        proposal.BusinessId = businessId;
        proposal.CostEstimate = costEstimate;
        proposal.Timeline = timeline;
        proposal.Description = description;

        await ctx.stub.putState(proposal.ID, Buffer.from(JSON.stringify(proposal)));
        return proposal;
    }

    @Transaction(false)
    public async GetProposal(ctx: Context, id: string): Promise<Proposal> {
        return JSON.parse(await this.ReadEntry(ctx, `Proposal:${id}`)) as Proposal;
    }

    @Transaction(false)
    public async GetProposalsByInitiativeID(ctx: Context, initiativeId: string): Promise<Proposal[]> {
        const startKey = 'Proposal:';
        const endKey = 'Proposal:~';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const results = [];

        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                const proposal = JSON.parse(res.value.value.toString()) as Proposal;
                if (proposal.InitiativeId === initiativeId) {
                    results.push(proposal);
                }
            }
            res = await iterator.next();
        }
        await iterator.close();

        return results;
    }

    // UpdateInitiative updates a given initiative with the given properties.
    @Transaction()
    public async UpdateProposal(ctx: Context, id: string, property: string, newValue: string): Promise<Proposal> {
        const proposalString = await this.ReadEntry(ctx, `Proposal:${id}`);
        if (proposalString.length === 0) {
            throw new Error(`Proposal with ID ${id} does not exist`);
        }
        const proposal = JSON.parse(proposalString) as Proposal;

        if (!(property in proposal)) {
            throw new Error(`Property ${property} does not exist on Proposal`);
        }
        // overwriting original value with new value
        (proposal as any)[property] = newValue;
        
        await ctx.stub.putState(proposal.ID, Buffer.from(stringify(sortKeysRecursive(proposal))));
        return proposal;
    }




    // === Crowdfunding Methods ===

    @Transaction(true)
    public async ContributeFund(ctx: Context, initiativeId: string, contributorId: string, amount: number): Promise<Fund> {
        const initiative = await this.ReadEntry(ctx, initiativeId);
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
}
