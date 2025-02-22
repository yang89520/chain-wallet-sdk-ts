const bip39 = require("bip39")
const HDKey = require('ed25519-hd-key');
const stellarBase = require("@stellar/stellar-base");

export function generateMnemonic(entropyBits = 128, language = "english", rngFn = undefined) {
    const wordlist = bip39.wordlists[language];
    return bip39.generateMnemonic(entropyBits, rngFn, wordlist);
}

export function createAddress(seedHex: string, accountIndex: string) {
    const keyData = HDKey.derivePath(`m/44'/148'/${accountIndex}'`, seedHex).key;
    const key = stellarBase.Keypair.fromRawEd25519Seed(keyData)
    return {
        publicKey : key.publicKey(),
        privateKey : key.secret()
    }
}

export function importAddress (params: { privateKey: string; network: string; }) {
    const { privateKey, network } = params;
    const key = stellarBase.Keypair.fromSecret(privateKey)
    return key.publicKey();
}

export function verifyAddress (params: { address: string; network: string; }) {
    const { address, network } = params;
    return stellarBase.StrKey.isValidEd25519PublicKey(address);
}

