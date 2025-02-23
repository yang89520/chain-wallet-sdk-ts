import {ECPair} from "@bitgo/utxo-lib";
import {privateKeyWIFToKeyPair} from "../src/address";
// @ts-ignore
import assert from "node:assert";
const zcashAddress = require("../src/address");
const utxolib = require("@bitgo/utxo-lib")
const network = utxolib.networks.zcash

describe('address_test', () => {
    test("Hello world", () =>{
       console.log("Hello world! Love you !!!");
    })

    test('createAddress T mainnet', () => {
        const mnemonic = "hybrid nasty soup match sorry adapt fork board major bulb bind pole source settle express trouble rude mouse orient april bridge quit obvious wing";
        const addressIndex = 0;
        const {privateKey,publicKey,address} = zcashAddress.mnemonicToTKeyPair(mnemonic, addressIndex);

        console.log("address:", address);
        const hexPublicKey = Buffer.from(publicKey).toString("hex");
        console.log("hexPublicKey:", hexPublicKey);

        const pair = ECPair.fromPrivateKey(Buffer.from(privateKey));
        const compressPrivateKey = pair.toWIF();
        console.log("compressPrivateKey:", compressPrivateKey);

        assert.strictEqual(address, 't1QzsGFr2iNTxNGAmhw2Nv8P85BG9XU31JJ');
        assert.strictEqual(compressPrivateKey, 'L3QNfJsKpnjFYjNPzYRKM12re4mTPsJjfFKyVe25VFVg4hRZVzcD');
        assert.strictEqual(hexPublicKey, '036e418e6b13e19614d67e281d2635fff7fa5e5d6e10eb6ed03d59dd3fd570ad5c');

    });

    test("import privateKey", () =>{
        const compressPrivateKey = 'L3QNfJsKpnjFYjNPzYRKM12re4mTPsJjfFKyVe25VFVg4hRZVzcD';
        const pair = privateKeyWIFToKeyPair(compressPrivateKey);
        assert.strictEqual(pair.address, 't1QzsGFr2iNTxNGAmhw2Nv8P85BG9XU31JJ');
        assert.strictEqual(pair.privateKey, 'L3QNfJsKpnjFYjNPzYRKM12re4mTPsJjfFKyVe25VFVg4hRZVzcD');
        assert.strictEqual(pair.publicKey, '036e418e6b13e19614d67e281d2635fff7fa5e5d6e10eb6ed03d59dd3fd570ad5c');
    })


    test("get zcash version",() => {
        const fromBase58Check = utxolib.address.fromBase58Check("t1TQq6QuWYpLNTkwu9i2HiJMRjjqYTLFH4t",network);
        console.log('version', fromBase58Check.version);
        assert.strictEqual(7352, fromBase58Check.version);
    })

})

