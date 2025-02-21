import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";
import { KeyPair, keyPairFromPrivateKey } from "@nodefactory/filecoin-address";

    export function keyDerive(mnemonic: string, path: string, network: string = "mainnet"): KeyPair {
        // Get seed from mnemonic
        const seed = mnemonicToSeedSync(mnemonic);
        return keyDeriveFromSeed(seed, path, network);
    }

    function keyRecover(privateKey: string, network: string = "mainnet"): KeyPair {
        if (privateKey.slice(-1) === "=") {
            privateKey = Buffer.from(privateKey, "base64").toString("hex");
        }

        return keyPairFromPrivateKey(privateKey, network === "mainnet" ? "f" : "t");
    }

    function keyDeriveFromSeed(seed: Buffer, path: string, network: string = "mainnet"): KeyPair {
        // Master Key
        const masterKey = fromSeed(seed);

        // Derive Child Key
        const childKey = masterKey.derivePath(path);

        // Recover Keys from Private Key
        return keyRecover(Buffer.from(childKey.privateKey).toString("hex"), network);
    }
