const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);
const bs58check = require('bs58check');
import { Client, NetworkId } from 'mina-signer'
const bip39 = require('bip39')
// 使用助记词生成密钥对


export async function createMinaAddress (mnemonic: string, network: string) {

    const seed = await bip39.mnemonicToSeedSync(mnemonic)
    const masterNode = bip32.fromSeed(seed)
    let hdPath = "m/44'/12586'/0'/0/0"
    const child0 = masterNode.derivePath(hdPath)
    child0.privateKey[0] &= 0x3f;
    const childPrivateKey = reverse(child0.privateKey)
    const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`
    const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'))
    const client = new Client({ network: network as NetworkId })
    const publicKey = client.derivePublicKey(privateKey)
    console.log(privateKey)
    console.log(publicKey)

}
function reverse (bytes: Buffer) {
    const reversed = Buffer.alloc(bytes.length);
    for (let i = bytes.length; i > 0; i--) {
        reversed[bytes.length - i] = bytes[i - 1];
    }
    return reversed;
}