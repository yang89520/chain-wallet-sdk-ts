import * as bip from './bip/bip';
import bip32utils from "bip32-utils";
import bitcoinjs from "bitcoinjs-lib"
import * as zencashjs from 'zencashjs';

export function test() {
  console.log("test");
}

//reference: https://github.com/HorizenOfficial/zencash-mobile/blob/master/src/utils/wallet.js#L44
export function phraseToSecretItems(count: number, mnemonic: string) {
  // Seed key, make it very strong
  // phraseStr: string
  const seedHex = bip.mnemonicToSeed({ mnemonic: mnemonic, password: '' }).toString("hex")

  // chains
  const hdNode = bitcoinjs.HDNode.fromSeedHex(seedHex)
  var chain = new bip32utils.Chain(hdNode)

  for (var k = 0; k < count; k++) {
    chain.next()
  }
  // Get private keys from them
  var secretItems = chain.getAll().map(function (x: any) {
    // Get private key (WIF)
    const pkWIF = chain.derive(x).keyPair.toWIF()

    // Private key
    const privKey = zencashjs.address.WIFToPrivKey(pkWIF)

    // Public key
    const pubKey = zencashjs.address.privKeyToPubKey(privKey, true)

    // Address
    const address = zencashjs.address.pubKeyToAddr(pubKey)

    return {
      wif: pkWIF,
      privateKey: privKey,
      pubKey,
      address,
    }
  })
  return secretItems
}

// reference: https://github.com/HorizenOfficial/zencashjs/blob/master/test/transaction.js#L96
// reference: https://github.com/HorizenOfficial/zencash-mobile/blob/master/src/containers/SendPage.js#L352
// reference: https://github.com/HorizenOfficial/arizen/blob/master/app/main.js#L1931
export function signTransaction(txParams: any, secretItems: any) {
  var txobj = zencashjs.transaction.createRawTx(
    txParams.paramIn,
    txParams.paramOut,
    txParams.blockHeight - 300,
    txParams.blockHash
  )

  console.log(secretItems.privateKey)
  console.log(typeof (secretItems.privateKey))
  const compressPubKey = true
  const SIGHASH_ALL = 1
  const signedobj = zencashjs.transaction.signTx(txobj, 0, secretItems.privateKey, compressPubKey, SIGHASH_ALL)


  return zencashjs.transaction.serializeTx(signedobj)
}

export function signTransaction2(txobj: any, secretItems: any) {
  const compressPubKey = true
  const SIGHASH_ALL = 1
  const signedobj = zencashjs.transaction.signTx(txobj, 0, secretItems.privateKey, compressPubKey, SIGHASH_ALL)


  return zencashjs.transaction.serializeTx(signedobj)
}
