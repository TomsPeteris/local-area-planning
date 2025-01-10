
export class Initiative {

    public ID: string = '';


    public Title: string = '';


    public Description: string = '';


    public Proposer: string = ''; // User ID of proposer


    public CurrentVotes: number = 0;


    public VotesRequired: number = 10;


    public Status: 'Proposed' | 'Approved' | 'Rejected' | 'VotesCollected' | 'Funded' | 'Completed' = 'Proposed';

    public Followed: boolean = false;
    // 
    // public SupportDocs?: string[]; // Optional list of file links
}


export class Vote {

    public InitiativeId: string = '';


    public VoterId: string = ''; // User ID


    public Vote: boolean = false; // true for support, false otherwise
}


export class ProjectProposal {

    public ID: string = '';


    public InitiativeId: string = '';


    public BusinessId: string = ''; // Business submitting the proposal


    public CostEstimate: number = 0;


    public Timeline: string = ''; // Description of the timeline

    // 
    // public Credentials: string[] = []; // List of document URLs supporting the proposal


    public Status: 'Submitted' | 'Approved' | 'Rejected' = 'Submitted';
}


export class Fund {

    public InitiativeId: string = '';


    public ContributorId: string = ''; // User or Organization contributing


    public Amount: number = 0;
}

export class Proposal {
    public ID: string = '';

    public InitiativeId: string = '';

    public BusinessId: string = ''; // Business submitting the proposal

    public CostEstimate: string = '';

    public Timeline: string = ''; // Description of the timeline

    public Description: string = '';

    public Status: 'Submitted' | 'Approved' | 'Rejected' = 'Submitted';
}