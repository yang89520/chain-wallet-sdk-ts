# Stacks (STX) Blockchain 研究报告

## 一、链的特性
Stacks链是一个构建在比特币之上的Layer 2区块链，旨在通过智能合约和去中心化应用扩展比特币的功能。其共识机制采用Proof of Transfer（PoX），矿工需要通过提交比特币（BTC）来挖掘Stacks块，这些块随后锚定到比特币区块链以确保安全性。

### RPC URL
- Mainnet: https://stacks-node-api.stacks.co
- Testnet: https://stacks-node-api.testnet.stacks.co

### RPC Api 官方Doc
- Hiro API 是由开发人员工具公司 Hiro 运营的集中式服务以RESTful与Stacks交互
    https://docs.stacks.co/reference/api
- 自建rpc节点 https://github.com/stacks-network/stacks-blockchain-docker

### 官方钱包
- Hiro Wallet (https://wallet.hiro.so/)
- Xverse Wallet (https://www.xverse.app/)

### 浏览器
- Stacks Explorer: https://explorer.stacks.co/
- Stacks.js Explorer: https://stacks-explorer.vercel.app/

### 账户模型还是 UTXO
Stacks 使用账户模型，类似于以太坊。账户状态通过账户余额直接管理，而不是通过追踪一系列未花费的交易输出。

### 签名算法
Stacks 使用 ECDSA 签名算法，具体使用的曲线是 secp256k1，与比特币兼容。

### 是否支持代币（Token）和 NFT

#### 代币标准协议
- 支持代币，主要标准是 SIP-010（Fungible Token Standard），类似于以太坊的 ERC-20。

#### NFT 标准协议
- 支持 NFT，主要标准是 SIP-009（Non-Fungible Token Standard），类似于以太坊的 ERC-721。

#### 代币精度
- STX 代币精度为 6 位小数，即 1 STX = 1,000,000 微 STX (μSTX)。

### 地址格式与生成方式

#### 支持的地址格式
Stacks 支持两种类型的地址格式：
- 单签地址：以 "SP" 开头的地址（主网）或 "ST" 开头的地址（测试网）
- 多签地址：以 "SM" 开头的地址（主网）或 "ST" 开头的地址（测试网）

#### 地址编码流程
1. 从助记词生成主私钥 (BIP32)
2. 从主私钥派生子私钥 (BIP32/BIP44)
3. 从私钥生成公钥 (secp256k1)
4. 计算公钥的 HASH160 (RIPEMD160(SHA256(publicKey)))
5. 添加版本前缀 (0x16 for Mainnet 单签, 0x17 for Testnet 单签)
6. 计算校验和 (取 Double SHA256 哈希的前 4 字节)
7. 拼接版本前缀 + HASH160 + 校验和
8. 使用 c32 编码 (类似于 base32 但针对 Stacks 优化)
9. 添加适当的前缀（"SP"、"ST" 或 "SM"）

#### 是否支持 HD 钱包
支持，Stacks 遵循 BIP32/BIP44 标准进行分层确定性钱包派生。
- 派生路径：m/44'/5757'/0'/0/0（默认）

#### 是否支持离线私钥生成
支持，可以通过离线方式生成私钥，实现冷钱包功能。

### 共识机制与确认位

#### 共识机制算法
Stacks 使用独特的 Proof of Transfer (PoX) 共识机制，该机制与比特币区块链挂钩。矿工通过在比特币上锁定 BTC 来铸造 Stacks 区块，这种机制被称为"堆叠"（Stacking）。

#### 确认位个数
一般认为 12 个确认块后交易被视为最终确认。Stacks 区块与比特币区块周期相关联，大约每 10 分钟一个区块。

这意味着一旦确认了区块，它就达到了 100% 比特币最终确定性的状态。实际上，这意味着 Stacks 区块与比特币交易一样不可逆转。

为了实现这一点，每个 Stacks 区块都与一个比特币区块承诺相关联。当矿工生成一个区块时，他们会包含一个索引区块哈希，该哈希将该区块锚定到比特币链上。一旦矿工的任期结束（对应于下一个比特币区块，N + 1），Stacks 链的状态（建立在先前的有效区块上）就会写入比特币区块链。这种联系保证了 Stacks 链的逆转需要重写比特币历史，这是一项计算和经济上都难以完成的任务。

总之，在 Stacks 中最终确定一个区块涉及通过索引哈希将其锚定到比特币，确保一旦写入，区块的状态在比特币的安全保障下几乎变得不可变。

### 是否支持质押、质押（Staking）方式

#### 质押是否需要锁定
是的，Stacks 的质押机制（称为 Stacking）需要锁定 STX 代币。锁定期为 1 个比特币奖励周期（约 2 周）或多个周期。

#### 是否支持委托质押
支持，用户可以委托他们的 STX 给 Stacking 池进行质押，无需自己运行节点，分享获得的比特币奖励。

### 是否支持 Tag/Memo
支持，Stacks 交易可以包含 memo 字段，最多可存储 34 字节的数据。

### 是否为多链结构
不是，Stacks 是一个单链结构，但它与比特币区块链有特殊联系，通过 PoX 共识机制实现安全性。

## 二、离线地址生成

### 可参考的 github 项目
- https://github.com/blockstack/stacks.js
- https://github.com/hirosystems/stacks-wallet-web
- https://github.com/fungible-systems/micro-stacks

### SDK 示例

#### 地址生成：createAddress
```javascript
import { generateWallet, createStacksPrivateKey, getAddressFromPrivateKey, StacksNetworkVersion } from '@stacks/wallet-sdk';

// 从助记词生成钱包
const wallet = generateWallet({ secretKey: Buffer.from('your-seed-phrase'), password: 'your-password' });
const privateKey = wallet.accounts[0].stxPrivateKey;

// 或直接从私钥创建
const privateKey = createStacksPrivateKey('your-private-key');

// 生成地址（主网）
const mainnetAddress = getAddressFromPrivateKey(privateKey, StacksNetworkVersion.mainnetP2PKH);

// 生成地址（测试网）
const testnetAddress = getAddressFromPrivateKey(privateKey, StacksNetworkVersion.testnetP2PKH);
```

#### 地址有效性检查：verifyAddress
```javascript
import { validateStacksAddress } from '@stacks/transactions';

// 检查地址是否有效
const isValid = validateStacksAddress(address);
```

#### 通过地址获取公钥：importAddress
```javascript
import { publicKeyToAddress, getPublicKey } from '@stacks/transactions';

// 注意：从地址无法直接获取公钥，但可以通过私钥获取公钥，再从公钥获取地址
const publicKey = getPublicKey(privateKey);
const address = publicKeyToAddress(publicKey);
```

## 三、离线签名

### 可参考的 github 项目
- https://github.com/blockstack/stacks.js
- https://github.com/hirosystems/stacks-wallet-web/tree/main/src/shared/signature
- https://github.com/fungible-systems/micro-stacks/tree/main/packages/core

### SDK 示例

#### 交易签名：signTransaction
```javascript
import {
  makeSTXTokenTransfer,
  createStacksPrivateKey,
  broadcastTransaction,
  AnchorMode,
  FungibleConditionCode,
} from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

// 创建私钥对象
const privateKey = createStacksPrivateKey('your-private-key');

// 构建交易
const transaction = await makeSTXTokenTransfer({
  recipient: 'SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159',
  amount: 12345, // 微 STX 单位 (0.012345 STX)
  senderKey: privateKey,
  network: new StacksTestnet(), // 或 new StacksMainnet()
  memo: 'test transaction',
  nonce: 0, // 需要获取当前 nonce
  fee: 300, // 费用，微 STX 单位
  anchorMode: AnchorMode.Any,
});

// 交易已签名，准备广播
const signedTransaction = transaction.serialize();

// 广播交易
const broadcastResponse = await broadcastTransaction(transaction, network);
console.log(broadcastResponse);
```

#### 构建交易账户：prepareAccount
```javascript
import { makeSTXTokenTransfer, createStacksPrivateKey } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

async function prepareAccount(privateKeyString, network) {
  // 创建私钥对象
  const privateKey = createStacksPrivateKey(privateKeyString);
  
  // 构建一个测试网对象
  const stacksNetwork = new StacksTestnet();
  
  // 返回一个账户对象
  return {
    privateKey,
    network: stacksNetwork
  };
}

// 使用示例
const account = await prepareAccount('your-private-key', 'testnet');
```

## 四、钱包相关扫链的 RPC 接口解析

### 获取账户余额
- 接口作用：获取账户余额
- 接口参数构造：GET 请求，参数为地址
- 接口请求 curl 示例：
```bash
curl --location 'https://stacks-node-api.mainnet.stacks.co/extended/v1/address/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7/balances'
```
- 接口请求 curl 响应示例：
```json
{
  "stx": {
    "balance": "10000000",
    "total_sent": "0",
    "total_received": "10000000",
    "lock_tx_id": "",
    "locked": "0",
    "lock_height": 0,
    "burnchain_lock_height": 0,
    "burnchain_unlock_height": 0
  },
  "fungible_tokens": {},
  "non_fungible_tokens": {}
}
```
- js 代码示例：
```javascript
import fetch from 'node-fetch';

async function getAccountBalance(address) {
  const url = `https://stacks-node-api.mainnet.stacks.co/extended/v1/address/${address}/balances`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

getAccountBalance('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')
  .then(balance => console.log(balance))
  .catch(error => console.error(error));
```

### 获取 nonce
- 接口作用：获取账户当前 nonce
- 接口参数构造：GET 请求，参数为地址
- 接口请求 curl 示例：
```bash
curl --location 'https://stacks-node-api.mainnet.stacks.co/v2/accounts/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7'
```
- 接口请求 curl 响应示例：
```json
{
  "balance": "10000000",
  "locked": "0",
  "unlock_height": 0,
  "nonce": 0,
  "balance_proof": "",
  "nonce_proof": ""
}
```
- js 代码示例：
```javascript
import fetch from 'node-fetch';

async function getAccountNonce(address) {
  const url = `https://stacks-node-api.mainnet.stacks.co/v2/accounts/${address}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.nonce;
}

getAccountNonce('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')
  .then(nonce => console.log('Current nonce:', nonce))
  .catch(error => console.error(error));
```

### 获取最低租金豁免余额
Stacks 没有类似 Solana 的最低租金豁免余额概念，但有最低余额要求。

- 接口作用：不适用
- 接口参数构造：不适用
- 接口请求 curl 示例：不适用
- 接口请求 curl 响应示例：不适用
- js 代码示例：不适用

### 获取 SPV
Stacks 本身并不使用 SPV（简化支付验证）机制，因为它是一个独立的区块链。但由于与比特币挂钩，可能有一些特殊的 SPV 相关功能。

- 接口作用：不适用于 Stacks
- 接口参数构造：不适用
- 接口请求 curl 示例：不适用
- 接口请求 curl 响应示例：不适用
- js 代码示例：不适用

### 获取最新块高
- 接口作用：获取链的最新块高
- 接口参数构造：GET 请求
- 接口请求 curl 示例：
```bash
curl --location 'https://stacks-node-api.mainnet.stacks.co/extended/v1/block'
```
- 接口请求 curl 响应示例：
```json
{
  "limit": 20,
  "offset": 0,
  "total": 118307,
  "results": [
    {
      "canonical": true,
      "height": 118306,
      "hash": "0xd7624cd0a33e64511813c291689b7f7101d781b66f63b713626901a4c7194bb5",
      "parent_block_hash": "0x9539f69b3bb4566f5251b5ab3fd2d05eddfe9e34c8c3a97e420fcffd80a07d66",
      "burn_block_time": 1701359894,
      "burn_block_time_iso": "2023-11-30T15:44:54.000Z",
      "burn_block_hash": "0x00000000000000000008b214bc6876d79e9217f9cf4c42ef0a10b0438db8458c",
      "burn_block_height": 818485,
      "miner_txid": "0xf3b31be6bddb6fc814e28e3f13bc218cb5cebb53573d28fa5cc42b44f4a50b78",
      "tx_count": 1,
      "execution_cost_read_count": 0,
      "execution_cost_read_length": 0,
      "execution_cost_runtime": 0,
      "execution_cost_write_count": 0,
      "execution_cost_write_length": 0
    }
    // 更多结果...
  ]
}
```
- js 代码示例：
```javascript
import fetch from 'node-fetch';

async function getLatestBlockHeight() {
  const url = 'https://stacks-node-api.mainnet.stacks.co/extended/v1/block';
  const response = await fetch(url);
  const data = await response.json();
  return data.results[0].height;
}

getLatestBlockHeight()
  .then(height => console.log('Latest block height:', height))
  .catch(error => console.error(error));
```

### 根据块高获取块内的交易信息
- 接口作用：根据块高获取块信息和交易
- 接口参数构造：GET 请求，参数为块高
- 接口请求 curl 示例：
```bash
curl --location 'https://stacks-node-api.mainnet.stacks.co/extended/v1/block/by_height/118000'
```
- 接口请求 curl 响应示例：
```json
{
  "canonical": true,
  "height": 118000,
  "hash": "0x9fc958d0fab91460a8a554b7ba23b9c6c8a69d2a1891a0af0625ab4d3ea6ac3b",
  "parent_block_hash": "0x9539f69b3bb4566f5251b5ab3fd2d05eddfe9e34c8c3a97e420fcffd80a07d66",
  "burn_block_time": 1701359894,
  "burn_block_time_iso": "2023-11-30T15:44:54.000Z",
  "burn_block_hash": "0x00000000000000000008b214bc6876d79e9217f9cf4c42ef0a10b0438db8458c",
  "burn_block_height": 818485,
  "miner_txid": "0xf3b31be6bddb6fc814e28e3f13bc218cb5cebb53573d28fa5cc42b44f4a50b78",
  "tx_count": 12,
  "txs": [
    "0x5f09bad79af639ff5d69b7fe9b8182a3541d99ce3c75d35dc7f3789c59fa63ab",
    "0x6cf5bf5b5053f99b91cd4548db63e94e5a82683a2af1c5e0a9c8fa7f10c3fc0d",
    // 更多交易...
  ],
  "execution_cost_read_count": 24560,
  "execution_cost_read_length": 3473400,
  "execution_cost_runtime": 9866000000,
  "execution_cost_write_count": 1230,
  "execution_cost_write_length": 120400
}
```

### 根据 payload hash 获取交易详情
- 接口作用：根据交易哈希获取交易详情
- 接口参数构造：GET 请求，参数为交易哈希
- 接口请求 curl 示例：
```bash
curl --location 'https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/0x5f09bad79af639ff5d69b7fe9b8182a3541d99ce3c75d35dc7f3789c59fa63ab'
```
- 接口请求 curl 响应示例：
```json
{
  "tx_id": "0x5f09bad79af639ff5d69b7fe9b8182a3541d99ce3c75d35dc7f3789c59fa63ab",
  "tx_type": "token_transfer",
  "fee_rate": "300",
  "sender_address": "SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS",
  "sponsored": false,
  "post_condition_mode": "deny",
  "post_conditions": [],
  "tx_status": "success",
  "block_hash": "0x9fc958d0fab91460a8a554b7ba23b9c6c8a69d2a1891a0af0625ab4d3ea6ac3b",
  "block_height": 118000,
  "burn_block_time": 1701359894,
  "burn_block_time_iso": "2023-11-30T15:44:54.000Z",
  "canonical": true,
  "event_count": 0,
  "events": [],
  "execution_cost_read_count": 4,
  "execution_cost_read_length": 1200,
  "execution_cost_runtime": 1000000,
  "execution_cost_write_count": 3,
  "execution_cost_write_length": 300,
  "tx_index": 0,
  "tx_result": {
    "hex": "0x0703",
    "repr": "(ok true)"
  },
  "token_transfer": {
    "recipient_address": "SPZ5WR94SM098H0NRV2FDK539ASX6AW5B6NGJNVQ",
    "amount": "1000000",
    "memo": "0x"
  }
}
```
- js 代码示例：
```javascript
import fetch from 'node-fetch';

async function getTransactionDetails(txId) {
  const url = `https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/${txId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

getTransactionDetails('0x5f09bad79af639ff5d69b7fe9b8182a3541d99ce3c75d35dc7f3789c59fa63ab')
  .then(txDetails => console.log(txDetails))
  .catch(error => console.error(error));
```

### 广播交易到区块链网络
- 接口作用：发送交易到区块链网络
- 接口参数构造：POST 请求，body 为序列化的交易
- 接口请求 curl 示例：
```bash
curl --location --request POST 'https://stacks-node-api.mainnet.stacks.co/v2/transactions' \
--header 'Content-Type: application/octet-stream' \
--data-binary '<serialized-transaction-hex>'
```
- 接口请求 curl 响应示例：
```json
{
  "txid": "0x5f09bad79af639ff5d69b7fe9b8182a3541d99ce3c75d35dc7f3789c59fa63ab"
}
```
- js 代码示例：
```javascript
import fetch from 'node-fetch';
import {
  makeSTXTokenTransfer,
  broadcastTransaction,
  createStacksPrivateKey,
  AnchorMode
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

async function sendTransaction(privateKeyString, recipientAddress, amount, memo = '', network = new StacksMainnet()) {
  // 创建私钥对象
  const privateKey = createStacksPrivateKey(privateKeyString);
  
  // 构建交易
  const transaction = await makeSTXTokenTransfer({
    recipient: recipientAddress,
    amount: amount,
    senderKey: privateKey,
    network: network,
    memo: memo,
    anchorMode: AnchorMode.Any,
    // 可以在这里指定 nonce 和 fee
  });
  
  // 广播交易
  const broadcastResponse = await broadcastTransaction(transaction, network);
  return broadcastResponse;
}

// 使用示例
sendTransaction(
  'private_key_here',
  'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  1000000, // 1 STX (以微单位)
  'Test transaction'
)
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

## 五、节点搭建文档

Stacks 节点可以以多种方式运行，包括完整节点、铸币节点和跟随节点。以下是搭建 Stacks 节点的官方文档：

- 主要节点搭建指南：https://docs.stacks.co/nodes-and-miners/stacks-node
- Github 节点代码仓库：https://github.com/stacks-network/stacks-blockchain
- Docker 快速部署指南：https://docs.stacks.co/nodes-and-miners/stacks-node/docker

基本节点搭建步骤：
1. 安装系统依赖（如 Rust、Git、Docker 等）
2. 克隆 Stacks 节点代码
3. 编译节点软件或使用 Docker 镜像
4. 配置节点参数（主网/测试网，数据目录等）
5. 启动节点并同步

## 附录

### RPC URL
- Mainnet: https://stacks-node-api.stacks.co
- Testnet: https://stacks-node-api.testnet.stacks.co
- 社区节点: https://stacks-node-api.xenon.blockstack.org

### 官方钱包 URL
- Hiro Wallet: https://wallet.hiro.so/
- Xverse Wallet: https://www.xverse.app/

### 浏览器 URL
- Stacks Explorer: https://explorer.stacks.co/
- Stacks.js Explorer: https://stacks-explorer.vercel.app/

### 官网 URL
- https://stacks.co/
- https://stacks.org/

### Discord URL
- https://discord.gg/stacks

### GitHub URL
- https://github.com/stacks-network
- https://github.com/hirosystems
- https://github.com/blockstack/stacks.js 
