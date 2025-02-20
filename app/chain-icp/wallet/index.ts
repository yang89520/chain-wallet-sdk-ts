import * as bip39 from 'bip39';
import {Secp256k1KeyIdentity} from "@dfinity/identity-secp256k1";
import {AccountIdentifier} from "@dfinity/ledger-icp";
import {uint8ArrayToHexString, hexStringToUint8Array} from "@dfinity/utils";
import {HDKey} from "@scure/bip32";


const {lebEncode} = require('@dfinity/candid');
const {HttpAgent, Actor, Principal} = require('@dfinity/agent');
const {ledgerIDL} = require('./ledger_idl');
const crypto = require('crypto');

const LEDGER_CANISTER_ID = Principal.fromText('ryjl3-tyaaa-aaaaa-aaaba-cai');

export function createIcpAddress(seed: Uint8Array, addressIndex: string) {
    const root = HDKey.fromMasterSeed(seed);
    const addressNode = root.derive("m/44'/223'/0'/0/" + addressIndex);
    const identity = Secp256k1KeyIdentity.fromSecretKey(<ArrayBuffer>addressNode.privateKey);
    const principal = identity.getPrincipal();
    const identifier = AccountIdentifier.fromPrincipal({principal});
    const address = identifier.toHex();
    const hdWallet = {
        publicKey: uint8ArrayToHexString(new Uint8Array(identity.getPublicKey().rawKey)),
        privateKey: uint8ArrayToHexString(new Uint8Array(identity.getKeyPair().secretKey)),
        principal: principal.toText(),
        address: address
    };
    return JSON.stringify(hdWallet);
}

export function importIcpAddress(params: any) {
    const {privateKey} = params;
    const identity = Secp256k1KeyIdentity.fromSecretKey(Buffer.from(privateKey, 'hex'));
    const principal = identity.getPrincipal();
    const identifier = AccountIdentifier.fromPrincipal({principal});
    const address = identifier.toHex();
    const hdWallet = {
        publicKey: Buffer.from(new Uint8Array(identity.getPublicKey().rawKey)).toString("hex"),
        privateKey: Buffer.from(new Uint8Array(identity.getKeyPair().secretKey)).toString("hex"),
        principal: principal.toText(),
        address: address
    };
    return JSON.stringify(hdWallet);
}

export async function offlineSign(message: string, privateKey: string) {
    try {
        const identity = Secp256k1KeyIdentity.fromSecretKey(hexStringToUint8Array(privateKey));
        const messageBuffer = Buffer.from(message);
        const nonce = crypto.randomBytes(32);
        const challenge = Buffer.concat([
            Buffer.from('\x1AIC-Request'),
            nonce,
            messageBuffer
        ]);
        const signature = await identity.sign(challenge);
        return {
            signature: Buffer.from(signature).toString('hex'),
            publicKey: Buffer.from(identity.getPublicKey().toDer()).toString('hex'),
            nonce: nonce.toString('hex'),
            signedMessage: challenge.toString('hex')
        };
    } catch (error) {
        console.error('Signing error:', error);
        throw error;
    }
}

export function toAccountIdentifier(principal: any, subaccount = new Uint8Array(32)) {
    const sha224 = require('js-sha256').sha224;
    const buffer = Buffer.concat([
        Buffer.from('\x0Aaccount-id'),
        Buffer.from(principal.toUint8Array()),
        Buffer.from(subaccount)
    ]);
    const hash = sha224(buffer);
    const checksum = crc32(Buffer.from(hash, 'hex'));
    return Buffer.concat([Buffer.from(checksum), Buffer.from(hash, 'hex')]).toString('hex');
}

export function crc32(data: any) {
    const crcTable = (() => {
        const table = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) {
                c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            }
            table[i] = c;
        }
        return table;
    })();

    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
    }
    return Buffer.from([(crc ^ 0xFFFFFFFF) >>> 0]).reverse();
}

export function createLedgerActor(agent: any) {
    return Actor.createActor(ledgerIDL, {
        agent,
        canisterId: LEDGER_CANISTER_ID,
    });
}

// @ts-ignore
async function scanICPTransactions(startBlock = 0n, length = 100n) {
    try {
        const agent = new HttpAgent({host: 'https://ic0.app'});
        const ledgerActor = createLedgerActor(agent);

        const queryArgs = {
            start: BigInt(startBlock),
            length: BigInt(length),
        };

        const response = await ledgerActor.query_blocks(queryArgs);

        console.log(`Chain length: ${response.chain_length}`);
        console.log(`First block index: ${response.first_block_index}`);
        console.log(`Queried blocks count: ${response.blocks.length}`);

        const transactions = response.blocks.map((block: any, index: number) => {
            const tx = block.transaction;
            return {
                blockIndex: Number(response.first_block_index) + index,
                timestamp: Number(block.timestamp.timestamp_nanos) / 1000000, // 转换为毫秒
                fromSubaccount: tx.from_subaccount[0] ? Buffer.from(tx.from_subaccount[0]).toString('hex') : null,
                to: tx.to,
                amount: Number(tx.amount.e8s) / 100000000, // 转换为 ICP
                memo: Number(tx.memo),
            };
        });

        // 处理归档块（如果有）
        if (response.archived_blocks.length > 0) {
            console.log('Found archived blocks:', response.archived_blocks.length);
            // 可以进一步查询归档数据，这里只打印提示
        }

        return {
            chainLength: Number(response.chain_length),
            transactions,
            hasMore: Number(response.first_block_index) + response.blocks.length < Number(response.chain_length),
        };
    } catch (error) {
        console.error('Error scanning transactions:', error);
        throw error;
    }
}


export function buildICPTransferRequest(params: any) {
    const {
        fromPrincipal,
        fromSubaccount = new Uint8Array(32), // 默认全0 subaccount
        toPrincipal,
        toSubaccount = new Uint8Array(32),   // 默认全0 subaccount
        amount,                              // 以e8s为单位 (1 ICP = 10^8 e8s)
        memo = BigInt(0),                    // 交易备注
        fee = BigInt(10000),                 // 默认转账费用 0.0001 ICP
    } = params;
    try {
        const from = Principal.fromText(fromPrincipal);
        const to = Principal.fromText(toPrincipal);

        const fromAccountId = toAccountIdentifier(from, fromSubaccount);
        const toAccountId = toAccountIdentifier(to, toSubaccount);

        const createdAtTime = BigInt(Date.now()) * BigInt(1000000);

        const transferArgs = {
            from_subaccount: fromSubaccount ? [fromSubaccount] : [],
            to: Buffer.from(to.toUint8Array()),
            amount: {e8s: BigInt(amount)},
            fee: {e8s: fee},
            memo: lebEncode(memo),
            created_at_time: [{timestamp_nanos: createdAtTime}],
        };

        return {
            request_type: 'call',
            canister_id: Principal.fromText('ryjl3-tyaaa-aaaaa-aaaba-cai'), // ICP Ledger Canister ID
            method_name: 'transfer',
            args: transferArgs,
            from_account_id: fromAccountId,
            to_account_id: toAccountId,
            amount: amount,
            memo: memo,
        };
    } catch (error) {
        console.error('Error building transfer request:', error);
        throw error;
    }
}

export function mnemonicToSeed(params: { mnemonic: any; password: any; }) {
    const {mnemonic, password} = params;
    if (!mnemonic) throw new Error('Must have mnemonic');
    return bip39.mnemonicToSeedSync(mnemonic, password);
}