import * as bip39 from 'bip39';
import {Secp256k1KeyIdentity} from "@dfinity/identity-secp256k1";
import {AccountIdentifier} from "@dfinity/ledger-icp";
import {uint8ArrayToHexString} from "@dfinity/utils";
import {HDKey} from "@scure/bip32";


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

export function importIcpAddress (params: any) {
    const { privateKey } = params;
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


export function mnemonicToSeed (params: { mnemonic: any; password: any; }) {
    const { mnemonic, password } = params;
    if (!mnemonic) throw new Error('Must have mnemonic');
    return bip39.mnemonicToSeedSync(mnemonic, password);
}