import tweetnacl from "tweetnacl";

global.XMLHttpRequest = require('xhr2');
const {derivePath} = require('ed25519-hd-key');
const oasis = require('@oasisprotocol/client');
import * as oasisRT from '@oasisprotocol/client-rt';

const cborg = require('cborg');
const ledger = require('@oasisprotocol/ledger');
const nic = new oasis.client.NodeInternal('https://grpc.oasis.io');


export async function createAddress(seedHex: string, addressIndex: number) {
    const {key} = derivePath("m/44'/474'/" + addressIndex + "'", seedHex);
    const {publicKey, secretKey} = tweetnacl.sign.keyPair.fromSeed(Uint8Array.from(key));
    const address = await oasisRT.address.fromSigspec({ed25519: new Uint8Array(publicKey)});
    const addressBench32 = oasisRT.address.toBech32(address);
    console.log(addressBench32);
    return {
        privateKey: Buffer.from(secretKey).toString('base64'),
        publicKey: Buffer.from(publicKey).toString('base64'),
        address: addressBench32
    };
}

export async function importAddress(privateKey: string) {
    const bufferKey = Uint8Array.from(Buffer.from(privateKey, 'base64'));
    const {publicKey} = tweetnacl.sign.keyPair.fromSecretKey(bufferKey);
    const address = await oasisRT.address.fromSigspec({ed25519: new Uint8Array(publicKey)});
    return oasisRT.address.toBech32(address);
}


export async function signTransactiongrpc(params: any) {
    const {srcPrivateKey, disPrivateKey} = params;

    const bufferKeysrc = Uint8Array.from(Buffer.from(srcPrivateKey, 'base64'));
    const src = oasis.signature.NaclSigner.fromSecret(bufferKeysrc, 'this key is not important');


    const bufferKeydst = Uint8Array.from(Buffer.from(disPrivateKey, 'base64'));
    const dst = oasis.signature.NaclSigner.fromSecret(bufferKeydst, 'this key is not important');

    const chainContext = await nic.consensusGetChainContext();

    const nonce = await nic.consensusGetSignerNonce({
        account_address: await oasis.staking.addressFromPublicKey(src.public()),
        height: oasis.consensus.HEIGHT_LATEST,
    });

    const account = await nic.stakingAccount({
        height: oasis.consensus.HEIGHT_LATEST,
        owner: await oasis.staking.addressFromPublicKey(src.public()),
    });
    if ((account.general?.nonce ?? 0) !== nonce) throw new Error('nonce mismatch');

    const tw = oasis.staking.transferWrapper();
    tw.setNonce(account.general?.nonce ?? 0);
    tw.setFeeAmount(oasis.quantity.fromBigInt(0));
    tw.setBody({
        to: await oasis.staking.addressFromPublicKey(dst.public()),
        amount: oasis.quantity.fromBigInt(0.02 * 1000000000),
    });

    const gas = await tw.estimateGas(nic, src.public());
    console.log("gas", gas)
    tw.setFeeGas(gas);

    await tw.sign(new oasis.signature.BlindContextSigner(src), chainContext);


    const dataBuf = Buffer.from(cborg.encode(tw.signedTransaction));
    console.log(dataBuf.toString("base64"));
    // await tw.submit(nic);
    console.log('sent');
}


export async function signTransaction(params: any) {
    const {privateKey, chainContext, gas, nonce, toAddress, amount} = params;
    const bufferKeysrc = Uint8Array.from(Buffer.from(privateKey, 'base64'));
    const src = oasis.signature.NaclSigner.fromSecret(bufferKeysrc, 'this key is not important');

    const tw = oasis.staking.transferWrapper();
    tw.setNonce(nonce);
    tw.setFeeAmount(oasis.quantity.fromBigInt(0));
    const realAmount = amount * 1000000000;
    tw.setBody({
        to: await oasis.staking.addressFromBech32(toAddress),
        amount: oasis.quantity.fromBigInt(realAmount),
    });
    tw.setFeeGas(gas);
    await tw.sign(new oasis.signature.BlindContextSigner(src), chainContext);
    const dataBuf = Buffer.from(cborg.encode(tw.signedTransaction));
    console.log(dataBuf.toString("base64"));
}


