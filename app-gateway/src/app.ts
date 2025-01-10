/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dotenv from 'dotenv';
import * as grpc from '@grpc/grpc-js';
import { connect, Contract, hash, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';
import express = require("express");
import session from 'express-session';
import { Initiative } from './dataTypes';
import { v4 as uuidv4 } from 'uuid';


dotenv.config();
const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
const mspId = envOrDefault('MSP_ID', 'Org1MSP');

// Path to crypto materials.
const cryptoPath = envOrDefault('CRYPTO_PATH', path.join(process.env.FABRIC_SAMPLE_TEST_NETWORK_PATH!, 'organizations', 'peerOrganizations', 'org1.example.com'));

// Path to user private key directory.
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.join(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));

// Path to user certificate directory.
const certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.join(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'));

// Path to peer tls certificate.
const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.join(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');

// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');

const utf8Decoder = new TextDecoder();
//const assetId = `asset${String(Date.now())}`;

interface User {
    id: string;
    permissions: "authority" | "bussiness" | "basic"
    name: string;
    password: string;
    following: string[];
    wallet: number;
}

declare module 'express-session' {
    interface SessionData {
        error: unknown;
        success: unknown;
        user: User;
    }
}

const app = express();
app.use(express.json());

app.use(express.urlencoded())
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
}));

app.use(function (req, res, next) {
    const err = req.session.error;
    const msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});


const users: Map<string, User> = new Map<string, User>();
users.set("Dome", { id: "asdfsdfga", permissions: "authority", name: "Dome", password: "1234", following: [], wallet: 200 });
users.set("Amazin", { id: "asdfsdfga-asasfd", permissions: "bussiness", name: "Amazin", password: "1234", following: [], wallet: 200 });
users.set("John", { id: "asdfsdfga-asasfd0sad", permissions: "basic", name: "John", password: "1234", following: [], wallet: 200 });
users.set("Peter", { id: "aa-asasfd0sad", permissions: "basic", name: "Peter", password: "1234", following: [], wallet: 200 });


function authenticate(name: string, pass: string, fn: (error: any, user?: User) => void) {
    const user = users.get(name);

    if (!user) { fn("Incorrect user or password"); return; }

    if (user.password !== pass) { fn("Incorrect user or password"); return; }

    fn(undefined, user)

}

function restrict(req: any, res: any, next: express.NextFunction) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.sendStatus(403);
    }
}

app.post('/login', (req, res, next) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    authenticate(req.body.username, req.body.password, (err, user) => {
        if (err) { next(err); return; }
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function () {
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name
                    + ' click to <a href="/logout">logout</a>. '
                    + ' You may now access <a href="/restricted">/restricted</a>.';

                res.status(200).send({ username: user.name, permissions: user.permissions });
            });
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.';
            res.sendStatus(403);
        }
    });
});

app.get('/user', restrict, (req, res) => {
    const user = req.session.user;
    if (!user) res.sendStatus(404);
    else {
        res.status(200).send({ username: user.name, permissions: user.permissions, following: user.following, wallet: user.wallet });
    }
})

app.post('/logout', (req, res) => {
    req.session.user = undefined;
    req.session.destroy(() => {
        res.sendStatus(200);
    });
});

app.get('/initiative', async (req, res) => {

    try {
        const contract = await connectBlockchain();
        const initiatives = await getAllInitiatives(contract, req.session.user);
        res.status(200).send(initiatives);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/initiative/followed', restrict, async (req, res) => {

    try {
        const contract = await connectBlockchain();
        const initiatives = await getAllInitiatives(contract, req.session.user);
        res.status(200).send(initiatives.filter(x => req.session.user?.following.some(f => f === x.ID)));
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/initiative/mine', restrict, async (req, res) => {

    try {
        const contract = await connectBlockchain();
        const initiatives = await getAllInitiatives(contract, req.session.user);
        res.status(200).send(initiatives.filter(x => x.Proposer === req.session.user?.id));
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/initiative/status/:Status', restrict, async (req, res) => {
    const { Status } = req.params;

    try {
        const contract = await connectBlockchain();
        const initiatives = await getAllInitiatives(contract, req.session.user);
        res.status(200).send(initiatives.filter(x => x.Status === Status));
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/initiative/:InitiativeID', async (req, res) => {
    const { InitiativeID } = req.params;

    try {
        const contract = await connectBlockchain();
        const initiative = await readInitiativeByID(contract, InitiativeID);
        initiative.Followed = req.session.user?.following.some(id => `Initiative:${id}` === initiative.ID) ?? false;
        res.status(200).send(initiative);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/initiative', restrict, async (req, res) => {
    const { InitiativeID, InitiativeTitle, InitiativeDescription } = req.body;

    try {
        const contract = await connectBlockchain();
        await createInitiative(contract, InitiativeID, InitiativeTitle, InitiativeDescription, req.session.user?.name ?? "");
        res.status(200).send(InitiativeID);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/initiative/:InitiativeID/follow', restrict, (req, res) => {
    const { InitiativeID } = req.params;

    try {
        req.session.user?.following.push(InitiativeID);
        req.session.save()
        res.status(200).send(InitiativeID);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/initiative/:InitiativeID/approve', restrict, async (req, res) => {
    const { InitiativeID } = req.params;
    if (req.session.user?.permissions !== "authority") res.sendStatus(403);

    try {
        const contract = await connectBlockchain();
        const initiative = await readInitiativeByID(contract, InitiativeID);

        if (initiative.Status === 'VotesCollected') {
            await updateInitiativeProperty(contract, InitiativeID, "Status", "Approved")
        } else {
            res.sendStatus(403);
        }

        res.status(200).send(InitiativeID);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.put('/initiative/:InitiativeID', restrict, async (req, res) => {
    const { InitiativeID } = req.params;
    const { PropertyName, PropertyValue } = req.body;

    try {
        const contract = await connectBlockchain();
        await updateInitiativeProperty(contract, InitiativeID, PropertyName, PropertyValue);
        res.status(200).send(InitiativeID);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/initiative/:InitiativeID/vote', restrict, async (req, res) => {
    const { InitiativeID } = req.params;

    try {
        const contract = await connectBlockchain();
        await voteOnInitiative(contract, InitiativeID, req.session.user?.id ?? '');
        const initiative = await readInitiativeByID(contract, InitiativeID);
        res.status(200).send(initiative);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/initiative/:InitiativeID/proposal', restrict, async (req, res) => {
    if (req.session.user?.permissions !== "bussiness") res.sendStatus(403);
    const { InitiativeID } = req.params;
    const { ProposalID, BusinessID, CostEstimate, Timeline, Description } = req.body;

    try {
        const contract = await connectBlockchain();
        await contract.submitTransaction(
            'CreateProposal',
            ProposalID,
            InitiativeID,
            BusinessID,
            CostEstimate,
            Timeline,
            Description,
        );

        res.status(200).send({ InitiativeID: InitiativeID, ProposalID: ProposalID });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/initiative/:InitiativeID/proposal', async (req, res) => {
    const { InitiativeID } = req.params;

    try {
        const contract = await connectBlockchain();
        const proposals = await contract.submitTransaction(
            'GetProposalsByInitiativeID',
            InitiativeID
        );

        res.status(200).send(proposals);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/proposal/:ProposalID', async (req, res) => {
    const { ProposalID } = req.params;

    try {
        const contract = await connectBlockchain();
        const proposal = await contract.submitTransaction(
            'GetProposal',
            ProposalID
        );

        res.status(200).send(proposal);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.put('/proposal/:ProposalID', async (req, res) => {
    const { ProposalID } = req.params;
    const { PropertyName, PropertyValue } = req.body;

    try {
        const contract = await connectBlockchain();
        const proposal = await contract.submitTransaction(
            'UpdateProposal',
            ProposalID,
            PropertyName,
            PropertyValue,
        );

        res.status(200).send(proposal);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/initiative/:InitiativeID/fund', restrict, async (req, res) => {
    const { InitiativeID } = req.params;
    const { Amount } = req.body;

    if (!req.session.user) {
        res.sendStatus(403);
        return;
    }

    const userFunds = req.session.user.wallet;
    if (userFunds < Number(Amount)) {
        res.status(400).send("Insufficient funds");
        return;
    }

    try {
        const fundID = uuidv4();
        const contract = await connectBlockchain();
        console.log(InitiativeID,
            req.session.user.name,
            Amount,)
        const Fund = await contract.submitTransaction(
            'ContributeFund',
            InitiativeID,
            req.session.user.name,
            Amount,
            fundID
        );
        req.session.user.wallet = userFunds - Amount;
        req.session.save();
        res.status(200).send(fundID);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

async function connectBlockchain(): Promise<Contract> {
    const client = await newGrpcConnection();

    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        hash: hash.sha256,
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
        },
    });

    // Get a network instance representing the channel where the smart contract is deployed.
    const network = gateway.getNetwork(channelName);

    // Get the smart contract from the network.
    const contract = network.getContract(chaincodeName);
    return contract;
}

async function newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity(): Promise<Identity> {
    const certPath = await getFirstDirFileName(certDirectoryPath);
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function getFirstDirFileName(dirPath: string): Promise<string> {
    const files = await fs.readdir(dirPath);
    const file = files[0];
    if (!file) {
        throw new Error(`No files in directory: ${dirPath}`);
    }
    return path.join(dirPath, file);
}

async function newSigner(): Promise<Signer> {
    const keyPath = await getFirstDirFileName(keyDirectoryPath);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

async function readInitiativeByID(contract: Contract, ID: string): Promise<Initiative> {
    console.log('\n--> Evaluate Transaction: ReadInitiative, function returns initiative attributes based on passed ID');

    const resultBytes = await contract.evaluateTransaction('GetInitiative', ID);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: Initiative = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return result;
}

async function voteOnInitiative(contract: Contract, ID: string, userID: string): Promise<void> {
    console.log('\n--> Evaluate Transaction: VoteOnInitiative, function returns if vote was added');

    const commit = await contract.submitAsync('VoteOnInitiative', {
        arguments: [ID, userID],
    });

    console.log(`*** Successfully submitted transaction to update votes`);
    console.log('*** Waiting for transaction commit');

    const status = await commit.getStatus();
    if (!status.successful) {
        throw new Error(`Transaction ${status.transactionId} failed to commit with status code ${String(status.code)}`);
    }

    console.log('*** Transaction committed successfully');
}


async function updateInitiativeProperty(contract: Contract, ID: string, property: string, newValue: string): Promise<void> {
    console.log('\n--> Evaluate Transaction: UpdateInitiative, function changes the specified property');

    const commit = await contract.submitAsync('UpdateInitiative', {
        arguments: [ID, property, newValue],
    });

    console.log(`*** Successfully submitted transaction to update initiative property`);
    console.log('*** Waiting for transaction commit');

    const status = await commit.getStatus();
    if (!status.successful) {
        throw new Error(`Transaction ${status.transactionId} failed to commit with status code ${String(status.code)}`);
    }

    console.log('*** Transaction committed successfully');
}

async function getAllInitiatives(contract: Contract, user?: User): Promise<Initiative[]> {
    console.log('\n--> Evaluate Transaction: GetAllInitiatives, function returns all initiatives that exist');

    const resultBytes = await contract.evaluateTransaction('GetAllInitiatives');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: Initiative[] = JSON.parse(resultJson);
    console.log('*** Result:', result);
    result.forEach(x => {
        x.Followed = user?.following.some(id => `Initiative:${id}` === x.ID) ?? false;
    })
    return result;
}


async function createInitiative(contract: Contract, InitiativeID: string, InitiativeTitle: string, InitiativeDescription: string, SubmitterID: string): Promise<void> {
    console.log('\n--> Submit Transaction: createInitiative, creates new initiative with ID, Title, Description, and Submitter arguments');

    await contract.submitTransaction(
        'CreateInitiative',
        InitiativeID,
        InitiativeTitle,
        InitiativeDescription,
        SubmitterID,
    );
};

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
function displayInputParameters(): void {
    console.log(`channelName:       ${channelName}`);
    console.log(`chaincodeName:     ${chaincodeName}`);
    console.log(`mspId:             ${mspId}`);
    console.log(`cryptoPath:        ${cryptoPath}`);
    console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
    console.log(`certDirectoryPath: ${certDirectoryPath}`);
    console.log(`tlsCertPath:       ${tlsCertPath}`);
    console.log(`peerEndpoint:      ${peerEndpoint}`);
    console.log(`peerHostAlias:     ${peerHostAlias}`);
}
