import {
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  validateStacksAddress,
  makeSTXTokenTransfer,
  broadcastTransaction,
  pubKeyfromPrivKey,
  publicKeyToString,
  AnchorMode,
  TransactionVersion,
} from '@stacks/transactions';
import {
  generateWallet as generateStacksWallet,
  generateSecretKey,
  generateNewAccount
} from '@stacks/wallet-sdk';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { Buffer } from 'buffer';
import {
  IStacksWallet,
  IStacksTransactionParams,
  ISignedTransaction,
  IStacksSDK,
  StacksNetwork
} from './types';
import { MnemonicGenerator } from './mnemonic';
import { TransactionSigner } from './transactions';
import { AccountManager } from './account';
import { NetworkManager } from './core/network';

export class StacksSDK implements IStacksSDK {
  private networkManager: NetworkManager;
  private accountManager: AccountManager;
  private mnemonicGenerator: MnemonicGenerator;
  private transactionSigner: TransactionSigner;

  constructor(network: StacksNetwork = StacksNetwork.Mainnet) {
    this.networkManager = new NetworkManager(network);
    this.accountManager = new AccountManager(this.networkManager);
    this.mnemonicGenerator = new MnemonicGenerator(this.accountManager);
    this.transactionSigner = new TransactionSigner(this.networkManager);
  }

  // 直接代理到相应的管理器
  generateMnemonic = (strength?: number) => this.mnemonicGenerator.generateMnemonic(strength);
  validateMnemonic = (mnemonic: string) => this.mnemonicGenerator.validateMnemonic(mnemonic);
  getPrivateKeyFromMnemonic = (mnemonic: string, path?: string) => this.mnemonicGenerator.getPrivateKeyFromMnemonic(mnemonic, path);
  generateWallet = (mnemonic?: string, password?: string) => this.mnemonicGenerator.generateWallet(mnemonic, password);
  createNewAccount = (wallet: IStacksWallet, password: string) => this.mnemonicGenerator.createNewAccount(wallet, password);

  getAddressFromPrivateKey = (privateKey: string) => this.accountManager.getAddressFromPrivateKey(privateKey);
  getPublicKeyFromPrivateKey = (privateKey: string) => this.accountManager.getPublicKeyFromPrivateKey(privateKey);
  validateAddress = (address: string) => this.accountManager.validateAddress(address);
  getBalance = (address: string) => this.accountManager.getBalance(address);
  getNonce = (address: string) => this.accountManager.getNonce(address);
  getTransactionHistory = (address: string) => this.accountManager.getTransactionHistory(address);
  getAssets = (address: string) => this.accountManager.getAssets(address);
  getAddressFromPublicKey = (publicKey: string) => this.accountManager.getAddressFromPublicKey(publicKey);

  signTransaction = (params: {
    from: string;
    to: string;
    amount: number;
    nonce: number;
    fee: number;
    memo: string
  }, privateKey: string): Promise<ISignedTransaction> => this.transactionSigner.signTransaction(params, privateKey);
  buildContractCall = (contractAddress: string, contractName: string, functionName: string, functionArgs: any[], privateKey: string) =>
    this.transactionSigner.buildContractCall(contractAddress, contractName, functionName, functionArgs, privateKey);

  setNetwork(network: StacksNetwork): void {
    this.networkManager.setNetwork(network);
  }
}

export default StacksSDK;

export {
  IStacksWallet,
  IStacksTransactionParams,
  ISignedTransaction,
  StacksNetwork
};
