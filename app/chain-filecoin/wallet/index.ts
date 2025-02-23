import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";
import { KeyPair, keyPairFromPrivateKey } from "@nodefactory/filecoin-address";
import { FilecoinSigner } from '@blitslabs/filecoin-js-signer';
import BigNumber from 'bignumber.js'
// initial filecoinSigner
const filecoinSigner = new FilecoinSigner();

// construct trasaction message
const createTransferMessage = (from:string, to:string, amount:number, nonce:number) => {
    return {
        From: from,
        To: to,
        Nonce: nonce, // 必须手动维护正确的nonce
        Value: new BigNumber(amount),
        GasLimit: 1000000000, // 需合理估算
        GasFeeCap: new BigNumber(100000), // 单位attoFIL
        GasPremium: new BigNumber(10000),
        Method: 0, // 0表示普通转账
        Params: ''
    }
}

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
    return keyRecover(Buffer.from(childKey.privateKey!).toString("hex"), network);
}



// signTransactionOffline
// @ts-ignore
function signTransactionOffline(unsignedMessage:createTransferMessage, privateKey:string) :string {
    return  filecoinSigner.tx.transactionSignLotus(
        unsignedMessage,
        privateKey
    )
}

//construct offline trasaction
export function executeOfflineSigning(from:string, to:string, amount:number, nonce:number,privateKey:string) :string{

    const rawMessage = createTransferMessage(
        from,
        to,
        amount,
        nonce
    )
    // signedMessage
    let signedMessage =  signTransactionOffline(rawMessage, privateKey);

    return signedMessage;
}