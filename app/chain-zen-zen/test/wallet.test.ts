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
    if (!mnemonic1 || !mnemonic2) {
        console.log("missing mnemonic, start generating.")
    }
    mnemonic1 = bip.generateMnemonic(24,)
    mnemonic2 = bip.generateMnemonic(24,)
});

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

test('sign transaction', async () => {
    const txobj = {
        paramIn: [
            {
                txid: '20fb67ff4f88c191505392faf11541653a2689e5273e4235c448f810cbe81488',
                vout: 0,
                scriptPubKey: '76a914fc3aa8612feb28feb03efa5065d576dbb67c9f8c88ac20bdf4487b6e0b336f24e43775aa46545081f719b17e2fb1786e7a25000000000003fa441ab4'
            },
            {
                txid: '40e2468bd53c9afef28f66367d89fc739269c3aa57fba7880c2428ee11e1fafe',
                vout: 1,
                scriptPubKey: '76a914fc3aa8612feb28feb03efa5065d576dbb67c9f8c88ac208a429e762f28a46da583c5a74fc93c0cfb434dbd90bfe915dbe07700000000000306441ab4'
            }
        ],
        paramOut: [{ address: 'znVmcBG35teueHJTuB1dQuc94XY733Z1Hec', satoshis: 970000 }
        ],
        blockHeight: 1721596, // 这里的blockHeight 为最新块-300的高度
        blockHash: '0000000000580b993309e9e09fbe1e7c860256b1a4e8c417bfb3dc59b201caab' //上面blockHeight所对应的hash
    }

    const privateKey = await wallet.phraseToSecretItems(0, mnemonic1)[0]
    console.log(privateKey)
    const sign = wallet.signTransaction(txobj, privateKey)
    console.log(sign)
});
