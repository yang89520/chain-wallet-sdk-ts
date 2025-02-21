import * as ecc from 'tiny-secp256k1';
const elliptic = require('elliptic');
const { BIP32Factory } = require('bip32');
const bip39 = require('bip39')
const bip32 = BIP32Factory(ecc);




//根据助剂词生成公私钥
export function CreateKeyByMnemonic (mnemonic: string)  {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed);
    // 获取第一个派生路径（例如 m/44'/60'/0'/0/0）
    const child = root.derivePath("m/44'/539'/0'/0/0");
    // 返回私钥
    const privateKey = child.privateKey.toString('hex');
    //使用secp256k1算法
    const ecdsa1 = new elliptic.ec('secp256k1');
    // 这是给定的私钥（以十六进制表示）
    const privateKeyHex = privateKey;
    // 使用私钥生成公钥
    const keyPair = ecdsa1.keyFromPrivate(Array.from(Buffer.from(privateKeyHex, 'hex')));

    const uncompressedPublicKey = keyPair.getPublic();
    // 假设 `keyPair` 是通过私钥生成的公私钥对
    // 获取未压缩公钥并去除前缀
    const uncompressedPublicKey1 = uncompressedPublicKey.encode('array', false); // 获取未压缩的公钥（包含 0x04 前缀）
    // 将结果转换为十六进制字符串
    const publicKeyHex = Buffer.from(uncompressedPublicKey1).toString('hex');
    const publicKey = publicKeyHex.slice(2, publicKeyHex.length);


    return {"privateKey":privateKey,"publicKey":publicKey}
}
