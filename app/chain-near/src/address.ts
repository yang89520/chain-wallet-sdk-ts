import { KeyPair } from "near-api-js";

export function generateAddress(): KeyPair {
    const keyPair = KeyPair.fromRandom("ED25519");
    return keyPair;
}

export function importPrivateKey(privateKey: string): KeyPair {
    const keyPair = KeyPair.fromString(privateKey);
    return keyPair;
}