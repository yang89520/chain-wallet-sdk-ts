import { sign as naclSign } from 'tweetnacl';
// @ts-ignore
import { full as naclAuthFull } from 'tweetnacl-auth';
import {b58cdecode, b58cencode, prefix} from '@taquito/utils';
const { derivePath } = require('ed25519-hd-key');
const bip39 = require("bip39")
import { blake2b } from 'blakejs';
import { InMemorySigner } from '@taquito/signer';

export const createAccountByMnemonic = (mnemonic: string, addressIndex: string) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
    const { key } = derivePath("m/44'/1729'/0'/" + addressIndex + "'", seed);
    const { secretKey, publicKey } = naclSign.keyPair.fromSeed(Buffer.from(key));
    return {
        sk: b58cencode(secretKey, prefix.edsk), // 私钥
        pk: b58cencode(publicKey, prefix.edpk), // 公钥
        pkh: b58cencode(blake2b(Buffer.from(publicKey), undefined, 20), prefix.tz1) // 公钥哈希（地址）
    };
};

export async function sign(bytes: string, sk: string): Promise<any> {
    const signer = new InMemorySigner(sk);
    const signed = await signer.sign(bytes,new Uint8Array([3]));
    return signed
}