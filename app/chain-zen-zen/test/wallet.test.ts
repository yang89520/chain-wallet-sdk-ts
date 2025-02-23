import * as wallet from "../wallet/index";
import * as dotenv from 'dotenv';
import * as bip from '../wallet/bip/bip';
import * as zencashjs from 'zencashjs';
import bitcoinjs from "bitcoinjs-lib"
import bip32utils from "bip32-utils"

var bs58check = require('bs58check');
var mnemonic1
var mnemonic2

beforeAll(() => {
    dotenv.config();
    mnemonic1 = process.env.MNEMONIC_1
    mnemonic2 = process.env.MNEMONIC_2
    console.log(mnemonic1)
    console.log(mnemonic2)
});

//znp5aYNr9f848b4pFH3pbX7wtRWrTaqb4cg
//znVmcBG35teueHJTuB1dQuc94XY733Z1Hec
//znjJKyVuBZq6SwZtJfj2aCxds8V3rWdjTCb
//zncEtJe7yxhqN8CDYgP6wdwTUX6AT5BodeV
//znahxNwKFYk2wwckzoWzyswQXc5iL9UtveU

describe('zen expect run pass test', () => {
    test('generate mnemonic', async () => {
        const mnemonic = bip.generateMnemonic(24,);
        console.log(mnemonic)
    });
});

test('generate wallet', async () => {
    const secretItems = await wallet.phraseToSecretItems(0, mnemonic1);
    secretItems.forEach((item) => {
        console.log(item);
    });
});

test('check address prefix', async () => {
    const secretItems = await wallet.phraseToSecretItems(5, mnemonic1);
    secretItems.forEach((item) => {
        console.log(item);
        const pre = bs58check.decode(item.address).toString('hex').slice(0, 4)
        console.log(pre)
    });
});

test('sign transaction1', async () => {
    const txobj = zencashjs.transaction.createRawTx(
        [{
            txid: 'e415b9596b89062a322d4ef32d2d1ef261ed368b0618f2eee0db3e63776e1d5f',
            vout: 0,
            scriptPubKey: '76a914fc3aa8612feb28feb03efa5065d576dbb67c9f8c88ac2023262c858a031197de6d6c905ce8d68bc744fe9b82850e8d9e103b010000000003d2431ab4'
        }],
        [{ address: 'znVmcBG35teueHJTuB1dQuc94XY733Z1Hec', satoshis: 700000 }
        ],
        1721330,
        '0000000002919e9974a4f025c815a1f13ce27c8cbd1e2568c8a179cff43d4341'
    )
    // This usually means the signature is wrong or incomplete, signature order matters with P2SH addresses. Private keys provided to spend from a P2SH address have to be given in the same order (skipping keys is okay when m < n, but still in the same order) as given when the P2SH address was generated.
    const privateKey = await wallet.phraseToSecretItems(0, mnemonic1)[0]
    console.log(privateKey)
    const sign = wallet.signTransaction2(txobj, privateKey)
    console.log(sign)
});

test('sign transaction2', async () => {
    // Create raw transaction at current height
    const blockHash = '00000001cf4e27ce1dd8028408ed0a48edd445ba388170c9468ba0d42fff3052'
    const blockHeight = 142091

    var txobj = zencashjs.transaction.createRawTx(
        [{
            txid: '59982119a451a162afc05d6ffe7c332a8c467d006b3bf95e9ff43599b4ed3d38',
            vout: 0,
            scriptPubKey: '76a914da46f44467949ac9321b16402c32bbeede5e3e5f88ac20c243be1a6b3d319e40e89b159235a320a1cd50d35c2e52bc79e94b990100000003d92c02b4'
        }],
        [{ address: 'znkz4JE6Y4m8xWoo4ryTnpxwBT5F7vFDgNf', satoshis: 1000000 }],
        blockHeight,
        blockHash
    )
    // This usually means the signature is wrong or incomplete, signature order matters with P2SH addresses. Private keys provided to spend from a P2SH address have to be given in the same order (skipping keys is okay when m < n, but still in the same order) as given when the P2SH address was generated.
    const privateKey = { privateKey: '2c3a48576fe6e8a466e78cd2957c9dc62128135540bbea0685d7c4a23ea35a6c' }
    console.log(privateKey)
    const sign = wallet.signTransaction2(txobj, privateKey)
    console.log(sign)

    expect(sign).toEqual('0100000001383dedb49935f49f5ef93b6b007d468c2a337cfe6f5dc0af62a151a419219859000000006a473044022035f718d8bafdec55f22d705fee46bd9f2c7cd4261c93a4f24161774b84c77e8b02205e9405e0518f4759b68333472090907f0a29c65bb5cf5e9f2ddf2532ddc506330121038a789e0910b6aa314f63d2cc666bd44fa4b71d7397cb5466902dc594c1a0a0d2ffffffff0140420f00000000003f76a914da46f44467949ac9321b16402c32bbeede5e3e5f88ac205230ff2fd4a08b46c9708138ba45d4ed480aed088402d81dce274ecf01000000030b2b02b400000000')
});

it('signTx() should be deterministic', function () {
    // Create raw transaction at current height
    const blockHash = '00000001cf4e27ce1dd8028408ed0a48edd445ba388170c9468ba0d42fff3052'
    const blockHeight = 142091

    var txobj = zencashjs.transaction.createRawTx(
        [{
            txid: '59982119a451a162afc05d6ffe7c332a8c467d006b3bf95e9ff43599b4ed3d38',
            vout: 0,
            scriptPubKey: '76a914da46f44467949ac9321b16402c32bbeede5e3e5f88ac20c243be1a6b3d319e40e89b159235a320a1cd50d35c2e52bc79e94b990100000003d92c02b4'
        }],
        [{ address: 'znkz4JE6Y4m8xWoo4ryTnpxwBT5F7vFDgNf', satoshis: 1000000 }],
        blockHeight,
        blockHash
    )

    const compressPubKey = true
    const SIGHASH_ALL = 1
    var signedobj = zencashjs.transaction.signTx(txobj, 0, '2c3a48576fe6e8a466e78cd2957c9dc62128135540bbea0685d7c4a23ea35a6c', compressPubKey, SIGHASH_ALL)
    var signed_serialized = zencashjs.transaction.serializeTx(signedobj)


    // check that we able to sign object after being serialized/deserialized with prevScriptPubKey
    var txobj_serialized_full = zencashjs.transaction.serializeTx(txobj, true)
    var txobj_deserialized_full = zencashjs.transaction.deserializeTx(txobj_serialized_full, true)

    signedobj = zencashjs.transaction.signTx(txobj_deserialized_full, 0, '2c3a48576fe6e8a466e78cd2957c9dc62128135540bbea0685d7c4a23ea35a6c', compressPubKey, SIGHASH_ALL)
    signed_serialized = zencashjs.transaction.serializeTx(signedobj)


    // check that we are NOT able to sign object being serialized/deserialized WITHOUT prevScriptPubKey
    var txobj_serialized = zencashjs.transaction.serializeTx(txobj)
    var txobj_deserialized = zencashjs.transaction.deserializeTx(txobj_serialized)

    var errorOccurred = false
    try {
        signedobj = zencashjs.transaction.signTx(txobj_serialized, 0, '2c3a48576fe6e8a466e78cd2957c9dc62128135540bbea0685d7c4a23ea35a6c', compressPubKey, SIGHASH_ALL)
    }
    catch (err) {
        errorOccurred = true
    }
    expect(errorOccurred).toEqual(true)
})
