import { ethers } from "ethers/lib";
import * as bip from "../src/bip/bip";
import * as wallet from "../src/zen/wallet";
import { arrayify } from "ethers/lib/utils";
import { keys } from "./env";

const keySet = keys
const k1 = keySet.at(0)
const k2 = keySet.at(1)

beforeAll(async () => {
    keySet.forEach(async (priK) => {
        if (priK.mnemonic === undefined || priK.mnemonic === '') {
            const mnemonicWords = bip.generateMnemonic({ number: 12, language: 'english' });
            ({
                mnemonic: priK.mnemonic,
                privateKey: priK.privateKey,
                publicKey: priK.publicKey,
                address: priK.address
            } = wallet.createZenWalletByWord(mnemonicWords))
        }
    });
});


describe('expect run pass test', () => {
    test('generate mnemonic', async () => {
        console.log(wallet.generateMnemonic())
    });

    test('create zen address', async () => {
        keySet.forEach(async (priK) => {
            // console.log(priK.mnemonic)
            const keyPair = wallet.createZenWalletByWord(priK.mnemonic)
            console.log(keyPair)
        });
    });

    test('verify privatekey create zen address', async () => {
        keySet.forEach(async (priK) => {
            const keyPair = wallet.createZenWalletByWord(priK.mnemonic)
            arrayify(keyPair.privateKey)
        });
    });
    test('verify publickey create zen address', async () => {
        keySet.forEach(async (priK) => {
            const keyPair = wallet.createZenWalletByWord(priK.mnemonic)
            arrayify(keyPair.publicKey)
        });
    });

    test('import zen address', async () => {
        keySet.forEach(async (priK) => {
            const keyPair = wallet.importZenWallet(wallet.createZenWalletByWord(priK.mnemonic).privateKey)
            expect(keyPair.privateKey).toBe(priK.privateKey)
            expect(ethers.utils.computePublicKey(keyPair.publicKey)).toBe(ethers.utils.computePublicKey(priK.publicKey))
            expect(keyPair.address).toBe(priK.address)
        });
    });

    test('verify zen address', async () => {
        keySet.forEach(async (priK) => {
            expect(wallet.verifyAddress(priK.address)).toBe(true)
        });
    });

    test('verify zen address', async () => {
        keySet.forEach(async (priK) => {
            expect(wallet.publicKeyToAddress(priK.publicKey))
        });
    });

    test('hex to number', async () => {
        const a = [
            28,
            21000,
            3919237255,
            18,
            1663,
        ]

        a.forEach((num) => {
            console.log(num)
            expect(wallet.numToHex(num)).toBe(ethers.utils.hexValue(num))
        })
    });

    test('sign zen transaction', async () => {
        console.log(k1?.privateKey.split('0x')[1])

        const rawHex = await wallet.zenSign({
            "privateKey": k1?.privateKey,
            "nonce": 2,
            "from": k1?.address,
            "to": k2?.address,
            "gasLimit": 21000,
            "amount": "0.000000000000000000001",
            "gasPrice": 20000000001,
            "decimal": 25,
            "chainId": 7332,
            "tokenAddress": "0x00"
        })
        console.log(rawHex)
    });

    test('sign zen transaction', async () => {
        ethers.utils.hexValue
    });

});


describe('expect error test', () => {
    const wrongMnemonicLists = [
        'unveil soap sword sponsor lion feed primary notable cement hurry learn haha',
        'unveil soap sword sponsor lion feed primary notable'
    ]

    //为什么这里的error没catch到
    // test('create zen address', () => {
    //     wrongMnemonicLists.forEach((priK) => {
    //         // console.log(priK.mnemonic)
    //         expect(wallet.createZenWalletByWord(priK, undefined)).toThrow();
    //         // console.log(keyPair)
    //     });
    // });


});
