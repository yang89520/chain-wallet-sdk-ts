import * as bip from "../wallet/bip/bip";

var mnemonicLength = [12, 15, 18, 21, 24];
var mnemonicList: string[] = [];

beforeAll(async () => {
    mnemonicLength.forEach(async (mnemonicNum) => {
        const mnemonicWords = bip.generateMnemonic({ number: mnemonicNum, language: 'english' });
        mnemonicList.push(mnemonicWords);
    });
});


describe('expect run pass test', () => {
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


describe('expect error test', () => {

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

