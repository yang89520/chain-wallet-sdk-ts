import { ethers } from "ethers/lib";
import * as bip from "../wallet/bip/bip";
import * as wallet from "../wallet/index";
import { arrayify } from "ethers/lib/utils";
import { keys } from "./env";

const keySet = keys
const k1 = keySet.at(0)
const k2 = keySet.at(1)

var mnemonicLength = [12, 15, 18, 21, 24];
var mnemonicList: string[] = [];

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

    mnemonicLength.forEach(async (mnemonicNum) => {
        const mnemonicWords = bip.generateMnemonic({ number: mnemonicNum, language: 'english' });
        mnemonicList.push(mnemonicWords);
    });
});

describe('zen expect run pass test', () => {
    test('generate mnemonic', async () => {
        const mnemonic = wallet.generateMnemonic()
        // console.log(mnemonic)
    });

    test('create zen address',  () => {
        keySet.forEach( (priK) => {
            // console.log(priK.mnemonic)
            const keyPair = wallet.createZenWalletByWord(priK.mnemonic)
            // console.log(keyPair)
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
            // console.log(num)
            expect(wallet.numToHex(num)).toBe(ethers.utils.hexValue(num))
        })
    });

    test('sign zen transaction', async () => {
        // console.log(k1?.privateKey.split('0x')[1])

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
        // console.log(rawHex)
    });

});


describe('zen expect error test', () => {
    const wrongMnemonicLists = [
        'unveil haha haha haha haha feed primary haha cement hurry learn haha',
    ]

    // test('create zen address', () => {
    //     wrongMnemonicLists.forEach((priK) => {
            // console.log(priK.mnemonic)
            // console.log(priK)
    //         expect(wallet.createZenWalletByWord(priK, undefined)).toThrow();
            // console.log(keyPair)
    //     });
    // });


});


describe('bip expect run pass test', () => {
    test('encode mnemonic', async () => {
        mnemonicList.forEach(async (mnemonicWords) => {
            const endoded = bip.encodeMnemonic({ mnemonic: mnemonicWords, language: 'english' });
            // console.log(endoded)
        });
    });

    test('decode encoded mnemonic', async () => {
        mnemonicList.forEach(async (mnemonicWords) => {
            const endoded = bip.encodeMnemonic({ mnemonic: mnemonicWords, language: 'english' });
            const decoded = bip.decodeMnemonic({ encrytMnemonic: endoded, language: 'english' });
            expect(decoded).toBe(mnemonicWords);
        });
    })

    test('mnemonic to seed', async () => {
        mnemonicList.forEach(async (mnemonicWords) => {
            const seed = bip.mnemonicToSeed({ mnemonic: mnemonicWords, password: '' });
            // console.log(seed)
        });
    });

    test('mnemonic to seed wrong input', async () => {
        expect(() => bip.mnemonicToSeed({ mnemonic: undefined, password: '' })).toThrow();
        // console.log(seed)
    });

    test('mnemonic to entropy', async () => {
        mnemonicList.forEach(async (mnemonicWords) => {
            const entropy = bip.mnemonicToEntropy({ mnemonic: mnemonicWords, language: 'english' });
            // console.log(entropy)
        });
    });

    test('validate mnemonic', async () => {
        mnemonicList.forEach(async (mnemonicWords) => {
            const validate = bip.validateMnemonic({ mnemonic: mnemonicWords, language: 'english' });
            expect(validate).toBe(true);
        });
    });

    test('check mnemonic length', async () => {
        mnemonicLength.forEach(async (mnemonicNum) => {
            const check = bip.CheckMnemonicLength(mnemonicNum);
            expect(check).toBe(true);
        });
    });

    test('get entropy bits', async () => {
        mnemonicLength.forEach(async (mnemonicNum) => {
            const bits = bip.GetEntropyBits(mnemonicNum);
            // console.log(bits)
        });
    });

    test('get EntropyBytesNum', async () => {
        mnemonicLength.forEach(async (mnemonicNum) => {
            const bits = bip.GetEntropyBytesNumber(mnemonicNum);
            // console.log(bits)
        });
    });

    test('get checksum length', async () => {

        mnemonicLength.forEach(async (mnemonicNum) => {
            const bits = bip.GetChecksumLength(mnemonicNum);
            // console.log(bits)
        });
    });

});


describe('bip expect error test', () => {

    test('get entropy bits with invalid input', async () => {
        const invalidLengths = [10, 13, 16, 19, 22];
        invalidLengths.forEach((mnemonicNum) => {
            expect(() => bip.generateMnemonic({ number: mnemonicNum, language: 'english' })).toThrow();
            expect(() => bip.generateMnemonic({ number: undefined, language: 'english' })).toThrow();
            expect(() => bip.generateMnemonic({ number: mnemonicNum, language: undefined })).toThrow();
        });
    });

    test('get entropy bits with invalid input', async () => {
        const invalidLanguage = ["huoxingwen", "Portuguese", "latin", "Tibetan"];
        invalidLanguage.forEach((language) => {
            expect(() => bip.generateMnemonic({ number: 12, language: language })).toThrow();
            expect(() => bip.generateMnemonic({ number: undefined, language: language })).toThrow();
            expect(() => bip.generateMnemonic({ number: 12, language: undefined })).toThrow();
        });
    });

    test('encodeMnemonic with invalid input', async () => {
        const invalidLanguage = ["huoxingwen", "Portuguese", "latin", "Tibetan"];
        invalidLanguage.forEach((language) => {
            expect(() => bip.encodeMnemonic({ mnemonic: mnemonicList.at(0), language: language })).toThrow();
            expect(() => bip.encodeMnemonic({ mnemonic: undefined, language: language })).toThrow();
            expect(() => bip.encodeMnemonic({ mnemonic: mnemonicList.at(0), language: undefined })).toThrow();
        });
    });

    test('decodeMnemonic with invalid input', async () => {
        const invalidLanguage = ["huoxingwen", "Portuguese", "latin", "Tibetan"];
        invalidLanguage.forEach((language) => {
            expect(() => bip.decodeMnemonic({
                encrytMnemonic:
                    bip.encodeMnemonic({ mnemonic: mnemonicList.at(0), language: 'english' }),
                language: language
            })).toThrow();
            expect(() => bip.decodeMnemonic({
                encrytMnemonic:
                    undefined,
                language: language
            })).toThrow();
            expect(() => bip.decodeMnemonic({
                encrytMnemonic:
                    bip.encodeMnemonic({ mnemonic: mnemonicList.at(0), language: 'english' }),
                language: undefined
            })).toThrow();
        });
    });

    test('check mnemonic length with invalid input', async () => {
        const invalidLengths = [10, 13, 16, 19, 22];
        invalidLengths.forEach((mnemonicNum) => {
            const check = bip.CheckMnemonicLength(mnemonicNum);
            expect(check).toBe(false);
        });
    });

    test('mnemonic to entropy', async () => {
        mnemonicList.forEach(async (mnemonicWords) => {
            const invalidLanguage = ["huoxingwen", "Portuguese", "latin", "Tibetan"];
            invalidLanguage.forEach((language) => {
                expect(() => bip.mnemonicToEntropy({ mnemonic: undefined, language: language })).toThrow();
                expect(() => bip.mnemonicToEntropy({ mnemonic: mnemonicList.at(0), language: undefined })).toThrow();
            });
            // console.log(entropy)
        });
    });

    test('validate mnemonic', async () => {
        mnemonicList.forEach(async (mnemonicWords) => {
            const invalidLanguage = ["huoxingwen", "Portuguese", "latin", "Tibetan"];
            invalidLanguage.forEach((language) => {
                expect(() => bip.validateMnemonic({ mnemonic: language, language: language })).toThrow();
                expect(() => bip.validateMnemonic({ mnemonic: undefined, language: language })).toThrow();
                expect(() => bip.validateMnemonic({ mnemonic: mnemonicList.at(0), language: undefined })).toThrow();
            });
        });
    });
});

