import {ECPair} from "@bitgo/utxo-lib";

const bip39 = require("bip39") ;
const utxolib = require("@bitgo/utxo-lib")
const crypto = require('crypto');
const network = utxolib.networks.zcash
const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);

export function mnemonicToTKeyPair(mnemonic:string, addressIndex:number) {
    // generate seed from mnemonic
    const seed = bip39.mnemonicToSeedSync(mnemonic, "")
    const masterKey = bip32.fromSeed(seed, network);
    const childKey = masterKey.derivePath(`m/44'/133'/0'/0/${addressIndex}`);
    const address = publicKeyToTransparentAddress(childKey.publicKey);
    return {
        privateKey: childKey.privateKey,
        publicKey: childKey.publicKey,
        address
    }
}

export function privateKeyWIFToKeyPair(privateKeyWIF:string){
    const keyPair = ECPair.fromWIF(privateKeyWIF);
    const address = publicKeyToTransparentAddress(keyPair.publicKey);
    return {
        privateKey: privateKeyWIF,
        publicKey: keyPair.publicKey.toString('hex'),
        address
    }

}


// generate transparent address
export  function publicKeyToTransparentAddress(publicKey: Buffer): string {
    const sha256Hash = crypto.createHash('sha256').update(publicKey).digest();
    const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();

    // the version NO of Zcash  is 7352
    const address = utxolib.address.toBase58Check(ripemd160Hash,7352,network)
    return address;
}