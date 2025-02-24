import { ethers } from "ethers/lib";
import * as bip from "../wallet/bip/bip";
import * as wallet from "../wallet/index";
import { arrayify } from "ethers/lib/utils";
import { keys } from "./env";

const keySet = keys
const k1 = keySet.at(0)
const k2 = keySet.at(1)

beforeAll(async () => {
    keySet.forEach(async (priK) => {
        if (priK.mnemonic === undefined || priK.mnemonic === '' || bip.validateMnemonic({ mnemonic: priK.mnemonic, language: 'english' }) === false) {
            console.log('mnemonic valid, generate new mnemonic')
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

describe('zen expect run pass test', () => {
    test('generate mnemonic', async () => {
        const mnemonic = wallet.generateMnemonic()
        console.log(mnemonic)
    });

    test('import zen address', async () => {
        keySet.forEach(async (priK) => {
            const keyPair = wallet.importZenWallet(wallet.createZenWalletByWord(priK.mnemonic).privateKey)
            expect(keyPair.privateKey).toBe(priK.privateKey)
            expect(ethers.utils.computePublicKey(keyPair.publicKey)).toBe(ethers.utils.computePublicKey(priK.publicKey))
            expect(keyPair.address).toBe(priK.address)
        });
    });
    test('sign zen transaction', async () => {

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

});