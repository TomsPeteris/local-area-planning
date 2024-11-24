/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Initiative {
    @Property()
    public id: string = '';

    @Property()
    public title: string = '';

    @Property()
    public description: string = '';

    @Property()
    public proposer: string = ''; // User ID of proposer

    @Property()
    public votes: number = 0;

    @Property()
    public status: 'Proposed' | 'Approved' | 'Rejected' | 'Funded' | 'Completed' = 'Proposed';

    // @Property()
    // public supportDocs?: string[]; // Optional list of file links
}

@Object()
export class Vote {
    @Property()
    public initiativeId: string = '';

    @Property()
    public voterId: string = ''; // User ID

    @Property()
    public vote: boolean = false; // true for support, false otherwise
}

@Object()
export class ProjectProposal {
    @Property()
    public id: string = '';

    @Property()
    public initiativeId: string = '';

    @Property()
    public businessId: string = ''; // Business submitting the proposal

    @Property()
    public costEstimate: number = 0;

    @Property()
    public timeline: string = ''; // Description of the timeline

    // @Property()
    // public credentials: string[] = []; // List of document URLs supporting the proposal

    @Property()
    public status: 'Submitted' | 'Approved' | 'Rejected' = 'Submitted';
}

@Object()
export class Fund {
    @Property()
    public initiativeId: string = '';

    @Property()
    public contributorId: string = ''; // User or Organization contributing

    @Property()
    public amount: number = 0;
}

@Object()
export class Project {
    @Property()
    public id: string = '';

    @Property()
    public initiativeId: string = '';

    @Property()
    public status: 'InProgress' | 'Completed' = 'InProgress';

    // @Property()
    // public progressUpdates: string[] = []; // Logs or URLs to updates
}

@Object()
export class User {
    @Property()
    public id: string = '';

    @Property()
    public role: 'Resident' | 'Authority' | 'Business' | 'Auditor' = 'Resident';

    @Property()
    public name: string = '';

    @Property()
    public wallet: number = 0; // Tracks contributions
}
