export interface IStacksWallet {
  privateKey: string;
  publicKey: string;
  address: string;
}

export interface IStacksTransactionParams {
  from: string;
  to: string;
  amount: number; // In micro STX (1 STX = 1,000,000 μSTX)
  fee?: number;
  nonce: number;
  memo?: string;
  chainId?: string;
  network?: 'mainnet' | 'testnet';
}

export interface ISignedTransaction {
  txHex: string;
  txId: string;
}

export interface IStacksConfig {
  network: 'mainnet' | 'testnet';
  rpcUrl?: string;
}

export enum StacksNetwork {
  Mainnet = 'mainnet',
  Testnet = 'testnet'
}

export interface IMnemonicGenerator {
  generateMnemonic(strength?: number): string;
  validateMnemonic(mnemonic: string): boolean;
  getPrivateKeyFromMnemonic(mnemonic: string, path: string): Promise<string>;
  getPublicKeyFromPrivateKey(privateKey: string): string;
  getAddressFromPublicKey(publicKey: string): string;
}

export interface IAccountManager {
  /**
   * 获取账户余额
   */
  getBalance(address: string): Promise<string>;

  /**
   * 获取账户 Nonce
   */
  getNonce(address: string): Promise<number>;

  /**
   * 获取账户交易历史
   */
  getTransactionHistory(address: string): Promise<Array<{
    txId: string;
    type: string;
    status: string;
    timestamp: number;
  }>>;

  /**
   * 获取账户资产列表
   */
  getAssets(address: string): Promise<Array<{
    assetId: string;
    amount: string;
    type: string;
  }>>;
}

export interface IStacksSDK extends IMnemonicGenerator, IAccountManager {
  generateWallet(mnemonic?: string): Promise<IStacksWallet>;
  getAddressFromPrivateKey(privateKey: string): string;
  validateAddress(address: string): boolean;

  signTransaction(params: {
    from: string;
    to: string;
    amount: number;
    nonce: number;
    fee: number;
    memo: string
  }, privateKey: string): Promise<ISignedTransaction>;
  setNetwork(network: StacksNetwork): void;
}

export interface ITransactionSigner {
  /**
   * 签名交易
   */
  signTransaction(params: IStacksTransactionParams, privateKey: string): Promise<ISignedTransaction>;

  /**
   * 广播交易
   */
  broadcastTransaction(signedTx: string): Promise<string>;

  /**
   * 构建合约调用交易
   */
  buildContractCall(
    contractAddress: string,
    contractName: string,
    functionName: string,
    functionArgs: any[],
    privateKey: string
  ): Promise<ISignedTransaction>;
}
