/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Initiative {
    @Property()
    public ID: string = '';

    @Property()
    public Title: string = '';

    @Property()
    public Description: string = '';

    @Property()
    public Proposer: string = ''; // User ID of proposer

    @Property()
    public CurrentVotes: number = 0;

    @Property()
    public VotesRequired: number = 10;

    @Property()
    public Status: 'Proposed' | 'Approved' | 'Rejected' | 'VotesCollected' | 'Funded' | 'Completed' = 'Proposed';

    // @Property()
    // public SupportDocs?: string[]; // Optional list of file links
}

@Object()
export class Vote {
    @Property()
    public VoteId: string = '';

    @Property()
    public InitiativeId: string = '';

    @Property()
    public VoterId: string = ''; // User ID

    @Property()
    public Vote: boolean = false; // true for support, false otherwise
}

@Object()
export class Proposal {
    @Property()
    public ID: string = '';

    @Property()
    public InitiativeId: string = '';

    @Property()
    public BusinessId: string = ''; // Business submitting the proposal

    @Property()
    public CostEstimate: string = '';

    @Property()
    public Timeline: string = ''; // Description of the timeline

    @Property()
    public Description: string = '';

    // @Property()
    // public Credentials: string[] = []; // List of document URLs supporting the proposal

    @Property()
    public Status: 'Submitted' | 'Approved' | 'Rejected' = 'Submitted';
}

@Object()
export class Fund {
    @Property()
    public ID: string = '';

    @Property()
    public InitiativeId: string = '';

    @Property()
    public ContributorId: string = ''; // User or Organization contributing

    @Property()
    public Amount: number = 0;
}