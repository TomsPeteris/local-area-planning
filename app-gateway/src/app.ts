/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dotenv from 'dotenv'
import * as grpc from '@grpc/grpc-js';
import { connect, Contract, hash, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';

dotenv.config();
const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
const mspId = envOrDefault('MSP_ID', 'Org1MSP');

// Path to crypto materials.
const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(process.env.FABRIC_SAMPLE_TEST_NETWORK_PATH!, 'organizations', 'peerOrganizations', 'org1.example.com'));

// Path to user private key directory.
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));

// Path to user certificate directory.
const certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'));

// Path to peer tls certificate.
const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');

// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');

const utf8Decoder = new TextDecoder();
//const assetId = `asset${String(Date.now())}`;

async function main(): Promise<void> {
    displayInputParameters();

    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
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

    try {
        // Get a network instance representing the channel where the smart contract is deployed.
        const network = gateway.getNetwork(channelName);

        // Get the smart contract from the network.
        const contract = network.getContract(chaincodeName);

        // Create a new asset on the ledger.
        await createInitiative(contract, "1", "Title", "Desc", "LmaoXDS");

        // await createInitiative(contract, "2", "Title2", "Desc2", "Tester2");


        await readInitiativeByID(contract, "1");

        // Vote
        await voteOnInitiative(contract, "1");

        await updateInitiativeProperty(contract, "1", "Proposer", "lule");

        await readInitiativeByID(contract, "1");

        await getAllInitiatives(contract);
    } finally {
        gateway.close();
        client.close();
    }
}

main().catch((error: unknown) => {
    console.error('******** FAILED to run the application:', error);
    process.exitCode = 1;
});

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



async function createInitiative(contract: Contract, InitiativeID: string, InitiativeTitle: string, InitiativeDescription: string, SubmitterID: string): Promise<void> {
    console.log('\n--> Submit Transaction: createInitiative, creates new initiative with ID, Title, Description, and Submitter arguments');

    await contract.submitTransaction(
        'createInitiative',
        InitiativeID,
        InitiativeTitle,
        InitiativeDescription,
        SubmitterID,
    );
}

async function readInitiativeByID(contract: Contract, ID: string): Promise<void> {
    console.log('\n--> Evaluate Transaction: ReadInitiative, function returns initiative attributes based on passed ID');

    const resultBytes = await contract.evaluateTransaction('ReadInitiative', ID);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: unknown = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

async function voteOnInitiative(contract: Contract, ID: string): Promise<void> {
    console.log('\n--> Evaluate Transaction: VoteOnInitiative, function returns if vote was added');

    const commit = await contract.submitAsync('VoteOnInitiative', {
        arguments: [ID],
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

async function getAllInitiatives(contract: Contract): Promise<void> {
    console.log('\n--> Evaluate Transaction: GetAllInitiatives, function returns all initiatives that exist');

    const resultBytes = await contract.evaluateTransaction('GetAllInitiatives');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: unknown = JSON.parse(resultJson);
    console.log('*** Result:', result);
}


/**
 * submitTransaction() will throw an error containing details of any error responses from the smart contract.
 */
// async function getNonExistentProposal(contract: Contract): Promise<void>{
//     console.log('\n--> Submit Transaction: getProjectProposal asset70, asset70 does not exist and should return an error');

//     try {
//         await contract.submitTransaction(
//             'getProjectProposal',
//             'asset70'
//         );
//         console.log('******** FAILED to return an error');
//     } catch (error) {
//         console.log('*** Successfully caught the error: \n', error);
//     }
// }

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
