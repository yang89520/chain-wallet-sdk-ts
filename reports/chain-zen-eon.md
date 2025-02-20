- [zen-chain 接入调研](#zen-chain-接入调研)
- [一.链的特性](#一链的特性)
  - [账户模型还是 UTXO](#账户模型还是-utxo)
  - [签名算法](#签名算法)
  - [代币精度](#代币精度)
  - [共识机制](#共识机制)
    - [确认位](#确认位)
    - [是否支持质押，POS 链是支持质押](#是否支持质押pos-链是支持质押)
  - [是否支持代币和 NFT(合约)](#是否支持代币和-nft合约)
  - [质押的方式](#质押的方式)
  - [是否支持 Tag/Memo](#是否支持-tagmemo)
  - [是否为多链结构](#是否为多链结构)
- [二.离线地址生成](#二离线地址生成)
  - [离线地址生成方式](#离线地址生成方式)
- [三.离线签名](#三离线签名)
- [四.扫链的 RPC 接口解析](#四扫链的-rpc-接口解析)
  - [扫链的 RPC 接口](#扫链的-rpc-接口)
    - [cex用](#cex用)
    - [hd用](#hd用)
  - [扫链回来的交易的解析](#扫链回来的交易的解析)
  - [扫链回来的交易手续费的计算](#扫链回来的交易手续费的计算)
- [五. 签名节点搭建](#五-签名节点搭建)
  - [钱包 RPC 节点的搭建方式](#钱包-rpc-节点的搭建方式)
- [六. 总结](#六-总结)
- [附录：](#附录)

## zen-chain 接入调研
zen正处在[Horizen 2.0 migration](https://www.horizen.io/horizen-upgrade) 升级中.目前,horizen[官网](https://www.horizen.io/)不提供pow链(zen)的文档,接口文档等,此调研仅针对horizen侧链(eon)

名词解释:
zen: Horizen's mainnet
eon: Horizen's Ethereum Virtual Machine

## 一.链的特性
### 账户模型还是 UTXO
账户模型

### 签名算法
ecdsa secp256k1
### 代币精度
8
### 共识机制
[Ouroboros Praos pos 共识](https://eprint.iacr.org/2017/573.pdf)
#### 确认位
到账:[1epoch(12h)](https://docs.horizen.io/horizen_eon/tutorials/faq/#stake-maturity)
可提币:2epoch(25h)

#### 是否支持质押，POS 链是支持质押
支持
### 是否支持代币和 NFT(合约)
支持
### 质押的方式
质押方式分为两种
1.将zen质押到eon forger节点
2.将zen质押到[自己启动的eon forger节点](https://docs.horizen.io/horizen_eon/tutorials/forger_node_setup_guide/)

最小质押量:
forger节点至少需要质押[10 zen](https://docs.horizen.io/horizen_eon/tutorials/forger_node_setup_guide/#eon-forger-node-criteria) 才能提出出块

也可将zen质押到其他forger节点,[每个质押创建时需要过一个完整epoch(12h30min)才能计入forger的质押量](https://docs.horizen.io/horizen_eon/tutorials/faq/#stake-maturity)

质押奖励:
```
transaction fee = gasUsed * baseFeePerGas + gasUsed * maxPriorityFeePerGas
```
basefee 按照每个forger在提现期结束前forge的块成比例(ethereum 的basefee直接烧掉)
priorityfee 则给forge这个block的forger
[详见此](https://docs.horizen.io/horizen_eon/tutorials/faq#what-is-the-eon-fee-redistribution-system)


### 是否支持 Tag/Memo
不支持
### 是否为多链结构
主链是zen 为pow,侧链为eon 为pos

## 二.离线地址生成
地址生成见:[wallet.ts]([https://github.com/the-web3/chain-wallet-sdk/blob/main/chain-zen-eon/src/zen/wallet.ts#L33)
```
function createZenAddressBySeedHex(seedHex: string, addressIndex: string, mnemonic: string) {
    const hdNode = ethers.utils.HDNode.fromSeed(Buffer.from(seedHex, 'hex'));
    const {
        privateKey,
        publicKey,
        address
    } = hdNode.derivePath("m/44'/60'/0'/0/" + addressIndex + '');
    return {
        mnemonic,
        privateKey,
        publicKey,
        address
    };
}
```
### 离线地址生成方式
同ethereum:
bip44协议路径派生,为ethereum同源链,coin_type=60:
```
"m/44'/60'/0'/0/0'"
```

## 三.离线签名
离线签名见:[wallet.ts]([https://github.com/the-web3/chain-wallet-sdk/blob/main/chain-zen-eon/src/zen/wallet.ts#L48)
```
export function zenSign(params: any) {
    ...
}
```
签名所需网络参数---[来源](https://docs.horizen.io/horizen_eon/connect/connect_your_wallet#horizen-eon)
```
  Network name:  Horizen EON
  New RPC URL:  https://eon-rpc.horizenlabs.io/ethv1
  Chain ID: 7332
  Currency symbol: ZEN
  Block Explorer: https://eon-explorer.horizenlabs.io/
  ----------------------------------------------------
  Network name:  Gobi Testnet
  New RPC URL:  https://gobi-rpc.horizenlabs.io/ethv1
  Chain ID: 1663 
  Currency symbol: TZEN
  Block Explorer: https://gobi-explorer.horizenlabs.io/
```

## 四.扫链的 RPC 接口解析
### 扫链的 RPC 接口
#### cex用
1.eth_syncing
检查连接节点是否同步
- request
```
curl --location 'https://eon-rpc.horizenlabs.io/ethv1/ethv1' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc":"2.0",
    "method":"eth_syncing",
    "params":[],
    "id":1
}'
```
-response
```
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": false
}
```
2.获取最新块高
eth_blockNumber
- request
```
curl --location 'https://eon-rpc.horizenlabs.io/ethv1/ethv1' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc":"2.0",
    "method":"eth_blockNumber",
    "params":[],
    "id":1
}'
```
-response
```
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x2b98e1"
}
```

3.根据num获取块信息
eth_getBlockByNumber
- request
```
curl --location 'https://eon-rpc.horizenlabs.io/ethv1/ethv1' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc":"2.0",
    "method":"eth_getBlockByNumber",
    "params":["latest",true],
    "id":1
}'
```
-response
```
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "number": "0x2b98b2",
        "hash": "0xd800c1319574d59e90c01d3c453f1679ce1e9cdf05b8d697024ec5c47e8b7bc2",
        "parentHash": "0xe1db290f9ce200ecb9f4e37863e68d6cb47e70884956ab79eb596005b2bbfb88",
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        "stateRoot": "0x08ef0b592c6c1d43a10d390996e9c201f7ec10efa1e88a1d5834d585f668a61b",
        "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        "miner": "0xba2290aeaae3e1ea336431911c97a67ebff46528",
        "size": "0x9d4",
        "gasLimit": "0x989680",
        "gasUsed": "0x0",
        "timestamp": "0x67b6ab43",
        "transactions": [],
        "baseFeePerGas": "0x4a817c800",
        "mixHash": "0x001183b33a3a00bfda5c7273ad6557e5cc5fc26d5bc9311b183fe93e381fa601",
        "uncles": [],
        "difficulty": "0x0",
        "totalDifficulty": "0x0",
        "nonce": "0x0000000000000000",
        "sha3Uncles": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
}
```

4.根据hash获取交易信息
eth_getTransactionByHash
- request
```
curl --location 'https://eon-rpc.horizenlabs.io/ethv1/ethv1' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc":"2.0",
    "method":"eth_getTransactionByHash",
    "params":["0x289e54ce389945ffec9ff1572d254d530ab9171c7a95adb7a60bb1bba7d0be35"],
    "id":1
}'
```
-response
```
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "blockHash": null,
        "blockNumber": null,
        "transactionIndex": null,
        "hash": "0x289e54ce389945ffec9ff1572d254d530ab9171c7a95adb7a60bb1bba7d0be35",
        "type": "0x0",
        "nonce": "0x2",
        "from": "0xb69da3d0055a6607f6709a1f4c7b5ea6bb2f35d7",
        "to": "0x5c3d25bdc401fbded06767a27f27de49279a6e68",
        "value": "0x2710",
        "input": "0x",
        "gas": "0x5208",
        "gasPrice": "0x4a817c801",
        "chainId": "0x1ca4",
        "v": "0x1b",
        "r": "0x24a088ca7221fd9126df43504e8e0b0a6c627e4d80d71a7ba3f2e71e699356b4",
        "s": "0x4ab31db1c8c8afa5feec76dbde3daa482d4f6e2ed2cae9c73d611124c009be3"
    }
}
```

5.根据hash获取收据信息
eth_getTransactionReceipt
- request
```
curl --location 'https://eon-rpc.horizenlabs.io/ethv1/ethv1' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc":"2.0",
    "method":"eth_getTransactionReceipt",
    "params":["0xa8495ad9a574205435eadc0e20a96e42e8a2b083b61f16bb1244dec02633fcc3"],
    "id":1
}'
```
-response
```
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "blockHash": "0xd134f90864f39ab40e680d638ba6175124b46811eccd1aea325ea75f410c9908",
        "blockNumber": "0x2b98db",
        "transactionIndex": "0x3",
        "transactionHash": "0xa8495ad9a574205435eadc0e20a96e42e8a2b083b61f16bb1244dec02633fcc3",
        "type": "0x0",
        "from": "0x339d413ccefd986b1b3647a9cfa9cbbe70a30749",
        "to": "0x3c2269811836af69497e5f486a85d7316753cf62",
        "effectiveGasPrice": "0x59682f000",
        "contractAddress": null,
        "logs": [],
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "gasUsed": "0x9465",
        "cumulativeGasUsed": "0x251d0",
        "status": "0x1"
    }
}
```

#### hd用
1.获取账户balance
eth_getBalance
- request
```
curl --location 'https://eon-rpc.horizenlabs.io/ethv1/ethv1' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc":"2.0",
    "method":"eth_getBalance",
    "params":["0xb69da3d0055A6607f6709a1F4C7B5eA6BB2f35d7"],
    "id":1
}'
```
-response
```
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x15bcf880382c000"
}
```
### 扫链回来的交易的解析
- 1.用于充值
from 地址为交易所外部地址
to 地址为交易所内部地址
- 2.用于提现
from 地址为交易所内部地址
to 地址为交易所外部地址
- 3.归集
from 地址为交易所内部地址
to 地址为热钱包地址
- 4.热转冷
from 地址为热钱包地址
to 地址为冷钱包地址
- 5.冷转热
from 地址为冷钱包地址
to 地址为热钱包地址

### 扫链回来的交易手续费的计算
gasLimit: 21000 (转账), 150000 (token和nft)

gasPrice: 通过接口eth_estimateGas得到的值 x 1.2/1.5/1.8

- request
```
curl --location 'https://eon-rpc.horizenlabs.io/ethv1/ethv1' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc":"2.0",
    "method":"eth_estimateGas",
    "params":[{
        "from":  "0x10FEDe72EEd94284B8Aa7002A8D46b347D83B91B",
        "to":    "0xd3CdA913deB6f67967B99D67aCDFa1712C293601",
        "value": "0x186a0"
    }],
    "id":1
}'
```
- response
```
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x5208"
}
```

## 五. 签名节点搭建
pnpm build

### 钱包 RPC 节点的搭建方式
https://docs.horizen.io/horizen_eon/tutorials/forger_node_setup_guide/

## 六. 总结
Horizen是一个EVM兼容的零知识网络，专注于Zk技术，致力于培育新一代zk-dApps,于2017年推出，其向更先进平台的转型标志着Horizen为每个人建立一个值得信赖和更安全的数字未来的使命的关键里程碑。

Horizen始于对隐私的承诺，并已发展成为创建一个全面的生态系统，开发人员可以在不影响安全性或可扩展性的情况下构建突破性的应用程序。

Horizen使开发人员能够构建安全和注重隐私的应用程序。通过零知识技术，实现隐私和可验证的信任，在保护敏感信息的同时确保合规性。从多个证明验证器中进行选择，以定制dapp，从而提高整个数字生态系统的性能和信任。

## 附录：
- cmc: https://coinmarketcap.com/currencies/horizen/
- 官网: https://www.horizen.io/
- github: https://github.com/HorizenOfficial
- discord: https://discord.com/invite/z8eebsj7Sv
- telegram: https://t.me/horizencommunity
- dao: https://horizen.discourse.group/
- scan/浏览器: https://eon-explorer.horizenlabs.io/
- 通过模块化证明验证层使Horizen技术现代化: https://horizen.discourse.group/t/zenip-42400-modernizing-horizen-technology-via-a-modular-proof-verification-layer/394
- Horizen 2.0 migration: https://www.horizen.io/horizen-upgrade
