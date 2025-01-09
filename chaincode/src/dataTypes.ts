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
    public Status: 'Proposed' | 'Approved' | 'Rejected' | 'Votes Collected' | 'Funded' | 'Completed' = 'Proposed';

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
    public InitiativeId: string = '';

    @Property()
    public ContributorId: string = ''; // User or Organization contributing

    @Property()
    public Amount: number = 0;
}

@Object()
export class Project {
    @Property()
    public ID: string = '';

    @Property()
    public InitiativeId: string = '';

    @Property()
    public Status: 'InProgress' | 'Completed' | 'Cancelled' = 'InProgress';

    // @Property()
    // public ProgressUpdates: string[] = []; // Logs or URLs to updates
}

@Object()
export class User {
    @Property()
    public ID: string = '';

    @Property()
    public Role: 'Resident' | 'Authority' | 'Business' | 'Auditor' = 'Resident';

    @Property()
    public Name: string = '';

    @Property()
    public Wallet: number = 0; // Tracks contributions
}
