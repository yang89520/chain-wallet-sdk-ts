import { KeyPair } from "near-api-js";

export function importPrivateKey(privateKey: string): { privateKey: string, publicKey: string, address: string } {
    const keyPair = KeyPair.fromString(privateKey);
    const publicKey = keyPair.getPublicKey();
    const address = publicKey.toString().replace("ed25519:", "");

    return {
        privateKey: keyPair.toString(),
        publicKey: publicKey.toString(),
        address: address
    };
}

export function generateNearAccount(): { privateKey: string, publicKey: string, address: string } {
    const keyPair = KeyPair.fromRandom("ED25519");
    const publicKey = keyPair.getPublicKey();
    const address = publicKey.toString().replace("ed25519:", "");

    return {
        privateKey: keyPair.toString(),
        publicKey: publicKey.toString(),
        address: address
    };
}