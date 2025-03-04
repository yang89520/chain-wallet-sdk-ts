import { generateMnemonic as genMnemonic, validateMnemonic as validateMnem, mnemonicToSeed } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from '@scure/bip32';
import { bytesToHex } from '@noble/hashes/utils';
import { generateWallet as generateStacksWallet, generateSecretKey, generateNewAccount } from '@stacks/wallet-sdk';
import { Buffer } from 'buffer';
import { IMnemonicGenerator, IStacksWallet } from './types';
import { AccountManager } from './account';
import { DEFAULT_DERIVATION_PATH, TEMP_PASSWORD } from './constants';

/**
 * 生成随机助记词
 * @param strength 助记词强度，默认为 128 位（12 个单词）
 * @returns 助记词字符串
 */
export function generateRandomMnemonic (): string {
  // 生成24个单词的助记词
  return genMnemonic(wordlist);
}

/**
 * 通过助记词生成主私钥
 * @param mnemonic 助记词
 * @param password 可选密码
 * @returns Buffer 格式的主私钥
 */
export async function getMasterPrivateKeyFromMnemonic (mnemonic: string, password = ''): Promise<Uint8Array> {
  const seed = await mnemonicToSeed(mnemonic, password);
  const masterKey = HDKey.fromMasterSeed(seed);
  return masterKey.privateKey || new Uint8Array();
}

/**
 * 通过助记词派生 Stacks 链的私钥
 * @param mnemonic 助记词
 * @param path 派生路径，默认为 Stacks 的标准路径 m/44'/5757'/0'/0/0
 * @param password 可选密码
 * @returns 私钥字符串（十六进制格式）
 */
export async function deriveStacksPrivateKey (
  mnemonic: string,
  path = "m/44'/5757'/0'/0/0",
  password = ''
): Promise<string> {
  const seed = await mnemonicToSeed(mnemonic, password);
  const hdKey = HDKey.fromMasterSeed(seed);
  const childKey = hdKey.derive(path);

  if (!childKey.privateKey) {
    throw new Error('Failed to derive private key');
  }

  return bytesToHex(childKey.privateKey);
}

/**
 * 通过助记词生成 Stacks 的密钥对和地址
 * @param mnemonic 助记词
 * @param path 派生路径
 * @param password 可选密码
 * @returns 包含私钥、公钥和地址的对象
 */
export async function createKeysByMnemonic (
  mnemonic: string,
  path = "m/44'/5757'/0'/0/0",
  password = ''
): Promise<{ privateKey: string; publicKey: string }> {
  const privateKeyHex = await deriveStacksPrivateKey(mnemonic, path, password);
  const seed = await mnemonicToSeed(mnemonic, password);
  const hdKey = HDKey.fromMasterSeed(seed);
  const childKey = hdKey.derive(path);

  return {
    privateKey: privateKeyHex,
    publicKey: bytesToHex(childKey.publicKey || new Uint8Array())
  };
}

export class MnemonicGenerator implements IMnemonicGenerator {
  private accountManager: AccountManager;

  constructor (accountManager: AccountManager) {
    this.accountManager = accountManager;
  }

  /**
   * 生成助记词
   */
  generateMnemonic (strength: number = 256): string {
    return genMnemonic(wordlist);
  }

  /**
   * 验证助记词
   */
  validateMnemonic (mnemonic: string): boolean {
    return validateMnem(mnemonic, wordlist);
  }

  /**
   * 从助记词派生私钥
   */
  async getPrivateKeyFromMnemonic (
    mnemonic: string,
    path: string = DEFAULT_DERIVATION_PATH
  ): Promise<string> {
    const seed = await mnemonicToSeed(mnemonic);
    const hdKey = HDKey.fromMasterSeed(seed);
    const childKey = hdKey.derive(path);

    if (!childKey.privateKey) {
      throw new Error('Failed to derive private key');
    }

    return bytesToHex(childKey.privateKey);
  }

  /**
   * 生成新钱包
   */
  async generateWallet (mnemonic?: string, password: string = TEMP_PASSWORD): Promise<IStacksWallet> {
    if (mnemonic && !validateMnem(mnemonic, wordlist)) {
      throw new Error('Invalid mnemonic');
    }

    const wallet = await generateStacksWallet({
      secretKey: generateSecretKey(),
      password
    });

    const privateKey = wallet.accounts[0].stxPrivateKey;
    const publicKey = this.accountManager.getPublicKeyFromPrivateKey(privateKey);
    const address = this.accountManager.getAddressFromPrivateKey(privateKey);

    return { privateKey, publicKey, address };
  }

  /**
   * 创建新账户
   */
  async createNewAccount (wallet: IStacksWallet, password: string): Promise<IStacksWallet> {
    const existingWallet = await generateStacksWallet({
      secretKey: wallet.privateKey,
      password
    });

    const newWallet = await generateNewAccount(existingWallet);
    const account = newWallet.accounts[newWallet.accounts.length - 1];
    const privateKey = account.stxPrivateKey;

    return {
      privateKey,
      publicKey: this.accountManager.getPublicKeyFromPrivateKey(privateKey),
      address: this.accountManager.getAddressFromPrivateKey(privateKey)
    };
  }

  getPublicKeyFromPrivateKey = (privateKey: string) => this.accountManager.getPublicKeyFromPrivateKey(privateKey);
  getAddressFromPublicKey = (publicKey: string) => this.accountManager.getAddressFromPublicKey(publicKey);
}
