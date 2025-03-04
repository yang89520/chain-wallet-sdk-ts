import {
  makeSTXTokenTransfer,
  makeContractCall,
  AnchorMode,
  broadcastTransaction,
  BufferCV,
  stringAsciiCV,
  standardPrincipalCV,
  createStacksPrivateKey,
  TransactionVersion,
  deserializeTransaction,
  bufferCV
} from '@stacks/transactions';
import { NetworkManager } from './core/network';
import { ITransactionSigner, IStacksTransactionParams, ISignedTransaction } from './types';

export class TransactionSigner implements ITransactionSigner {
  private networkManager: NetworkManager;

  constructor(networkManager: NetworkManager) {
    this.networkManager = networkManager;
  }

  /**
   * 签名交易
   * @param params 交易参数
   * @param privateKey 私钥
   * @returns 签名后的交易数据
   */
  async signTransaction (
    params: IStacksTransactionParams,
    privateKey: string
  ): Promise<ISignedTransaction> {
    const tx = await makeSTXTokenTransfer({
      recipient: params.to,
      amount: params.amount,
      senderKey: privateKey,
      network: this.networkManager.getInstance(),
      memo: params.memo,
      nonce: params.nonce,
      fee: params.fee,
      anchorMode: AnchorMode.Any
    });

    const serializedTx = tx.serialize();
    const txId = `0x${tx.txid()}`;

    return {
      txHex: Buffer.from(serializedTx).toString('hex'),
      txId
    };
  }

  /**
   * 广播交易
   * @param signedTx 已签名的交易数据
   * @returns 交易哈希
   */
  async broadcastTransaction(signedTx: string): Promise<string> {
    const transaction = deserializeTransaction(signedTx);
    const response = await broadcastTransaction(transaction, this.networkManager.getInstance());
    return response.txid;
  }

  /**
   * 构建合约调用交易
   * @param contractAddress 合约地址
   * @param contractName 合约名称
   * @param functionName 函数名称
   * @param functionArgs 函数参数
   * @param privateKey 私钥
   * @returns 签名后的交易数据
   */
  async buildContractCall(
    contractAddress: string,
    contractName: string,
    functionName: string,
    functionArgs: any[],
    privateKey: string
  ): Promise<ISignedTransaction> {
    // 将参数转换为 Clarity 值
    const clarityArgs = functionArgs.map(arg => {
      if (typeof arg === 'string') {
        if (arg.startsWith('ST')) {
          return standardPrincipalCV(arg);
        }
        return stringAsciiCV(arg);
      }
      if (Buffer.isBuffer(arg)) {
        return bufferCV(arg);
      }
      throw new Error(`Unsupported argument type: ${typeof arg}`);
    });

    // 构建合约调用交易
    const tx = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs: clarityArgs,
      senderKey: privateKey,
      network: this.networkManager.getInstance(),
      anchorMode: AnchorMode.Any
    });

    const serializedTx = tx.serialize();
    const txId = `0x${tx.txid()}`;

    return {
      txHex: Buffer.from(serializedTx).toString('hex'),
      txId
    };
  }
}
