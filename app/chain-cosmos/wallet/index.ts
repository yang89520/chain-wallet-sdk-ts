import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { Buffer } from "buffer";
import { mnemonicToSeedSync } from 'bip39';
import { Secp256k1Wallet  } from '@cosmjs/amino';
import { sha256, ripemd160 } from "@cosmjs/crypto";
import { bech32 } from "bech32";
const bip32 = BIP32Factory(ecc);
import { toBase64, fromHex} from '@cosmjs/encoding';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { SigningStargateClient } from "@cosmjs/stargate";
import { BigNumber } from "bignumber.js";







export async function generateWalletFromMnemonic(mnemonic: string) {

    const seed = mnemonicToSeedSync(mnemonic);


    const masterNode = bip32.fromSeed(seed);

    // path：m/44'/118'/0'/0/0 (Cosmos)
    const path = "m/44'/118'/0'/0/0";
    const child = masterNode.derivePath(path);

    if (!child.privateKey) {
        throw new Error("Unable to obtain private key, please check the mnemonic and derivation path");
    }


    const privateKey = Uint8Array.from(child.privateKey);


    const wallet = await Secp256k1Wallet.fromKey(privateKey, 'cosmos');
    const [account] = await wallet.getAccounts();


    const publicKeyHex = Buffer.from(account.pubkey).toString('hex');

    return {
        privateKey: Buffer.from(privateKey).toString('hex'),
        publicKey: publicKeyHex,
        address: account.address
    };
}




export async function signCosmosTransaction(params: {
    chainId: string;
    from: string;
    to: string;
    memo?: string;
    amount_in: string;
    fee: string;
    gas: string;
    accountNumber: number;
    sequence: number;
    decimal: number;
    privateKey: string;}): Promise<string> {

    const amount = new BigNumber(params.amount_in)
        .shiftedBy(params.decimal)
        .toFixed(0);
    const feeAmount = new BigNumber(params.fee)
        .shiftedBy(params.decimal)
        .toFixed(0);


    const sendMsg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: MsgSend.fromPartial({
            fromAddress: params.from,
            toAddress: params.to,
            amount: [{ denom: "uatom", amount }]
        })
    };


    const wallet = await Secp256k1Wallet.fromKey(
        fromHex(params.privateKey),
        "cosmos"
    );
    const client = await SigningStargateClient.offline(wallet);


    const txRaw = await client.sign(
        params.from,
        [sendMsg],
        {
            amount: [{ denom: "uatom", amount: feeAmount }],
            gas: params.gas
        },
        params.memo || "",
        {
            chainId: params.chainId,
            accountNumber: params.accountNumber,
            sequence: params.sequence
        }
    );


    return JSON.stringify({
        tx_bytes: toBase64(TxRaw.encode(txRaw).finish()),
        mode: "BROADCAST_MODE_SYNC"
    });
}


export function pubkeyToAddress(hexPublicKey: string, prefix = "cosmos"): string {
    // 验证公钥格式
    if (!/^[0-9a-fA-F]{66}$/.test(hexPublicKey)) {
        throw new Error("Invalid compressed SECP256k1 public key format");
    }

    // 转换为字节数组
    const publicKeyBytes = fromHex(hexPublicKey);

    // 计算哈希
    const shaHash = sha256(publicKeyBytes);
    const ripemdHash = ripemd160(shaHash);

    // Bech32 编码
    return bech32.encode(prefix, bech32.toWords(ripemdHash));
}