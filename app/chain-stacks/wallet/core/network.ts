import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { StacksNetwork } from '../types';

/**
 * 网络管理类
 */
export class NetworkManager {
  private networkInstance: StacksMainnet | StacksTestnet;

  constructor (network: StacksNetwork = StacksNetwork.Mainnet) {
    this.networkInstance = network === StacksNetwork.Mainnet
      ? new StacksMainnet()
      : new StacksTestnet();
  }

  /**
   * 获取当前网络实例
   */
  getInstance(): StacksMainnet | StacksTestnet {
    return this.networkInstance;
  }

  /**
   * 设置网络环境
   */
  setNetwork (network: StacksNetwork): void {
    this.networkInstance = network === StacksNetwork.Mainnet
      ? new StacksMainnet()
      : new StacksTestnet();
  }

  /**
   * 是否为主网
   */
  isMainnet(): boolean {
    return this.networkInstance instanceof StacksMainnet;
  }
}
