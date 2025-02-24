import * as bip39 from 'bip39';

export function generateMnemonic(number: number = 12, language: string = 'english') {

    if (!CheckMnemonicLength(number)) throw new Error('Mnemonic length Not Standard!');
    if (!bip39.wordlists.hasOwnProperty(language)) throw new Error('Language not supported');

    return bip39.generateMnemonic(GetEntropyBits(number), undefined, bip39.wordlists[language]);
}

export function encodeMnemonic(params: { mnemonic: any; language: any; }) {
    const { mnemonic, language } = params;

    if (!mnemonic || !language) throw new Error('Must have mnemonic and language');
    if (!bip39.wordlists.hasOwnProperty(language)) throw new Error('Language not supported');

    return bip39.mnemonicToEntropy(mnemonic, bip39.wordlists[language]);
}

export function decodeMnemonic(params: { encrytMnemonic: any; language: any; }) {
    const { encrytMnemonic, language } = params;

    if (!encrytMnemonic || !language) throw new Error('Must have mnemonic and language');
    if (!bip39.wordlists.hasOwnProperty(language)) throw new Error('Language not supported');

    return bip39.entropyToMnemonic(encrytMnemonic, bip39.wordlists[language]);
}

export function mnemonicToSeed(params: { mnemonic: any; password: any; }) {
    const { mnemonic, password } = params;

    if (!mnemonic) throw new Error('Must have mnemonic');

    return bip39.mnemonicToSeedSync(mnemonic, password);
}

export function mnemonicToEntropy(params: { mnemonic: any; language: any; }) {
    const { mnemonic, language } = params;

    if (!mnemonic || !language) throw new Error('Must have mnemonic and language');

    return bip39.mnemonicToEntropy(mnemonic, bip39.wordlists[language]);
}

export function validateMnemonic(params: { mnemonic: any; language: any; }) {
    const { mnemonic, language } = params;

    if (!mnemonic || !language) throw new Error('Must have mnemonic and language');
    if (!bip39.wordlists.hasOwnProperty(language)) throw new Error('Language not supported');

    return bip39.validateMnemonic(mnemonic, bip39.wordlists[language]);
}

export function CheckMnemonicLength(mnemonicNum: number) {
    return mnemonicNum == 12 || mnemonicNum == 15 || mnemonicNum == 18 || mnemonicNum == 21 || mnemonicNum == 24;
}

export function GetEntropyBits(mnemonicNum: number) {
    return mnemonicNum / 3 * 32
}

export function GetEntropyBytesNumber(mnemonicNum: number) {
    return mnemonicNum / 3 * 4
}

export function GetChecksumLength(mnemonicNum: number) {
    return mnemonicNum / 3
}
