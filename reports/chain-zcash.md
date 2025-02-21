# Zcash链钱包对接调研文档

## 1. Zcash概述
**Zcash 链简介**

**Zcash**（ZEC）是一个专注于隐私保护的加密货币，它基于 **Bitcoin**（比特币）的源代码，但引入了 **zk-SNARKs**（零知识简洁非交互式论证）技术，以增强交易的隐私性和安全性。Zcash 的目标是提供与比特币类似的去中心化、透明的支付系统，同时通过使用加密技术，确保用户的交易信息得到保护。Zcash 成立于 2016 年，由 Zcash 公司（由 Zooko Wilcox 创建）开发和维护。

**Zcash 特性**

​	1.	**隐私保护**

Zcash 引入了 **zk-SNARKs**（零知识简洁非交互式论证）技术，使得交易能够在不暴露交易金额、发送者或接收者地址的情况下得到验证。使用 zk-SNARKs 技术的交易被称为 **“shielded transactions”**（受保护交易）。这使得 Zcash 成为一个具有 **隐私保护** 的加密货币。

​	•	**透明交易**（Transparent Transactions）: 类似于比特币交易，信息是公开的，包括发送者、接收者和交易金额。

​	•	**受保护交易**（Shielded Transactions）: 只有交易的参与方和相关方可以看到交易细节，其他人无法获取交易的任何细节。

​	2.	**Zcash 交易类型**

​	•	**t-address**：透明地址（类似于比特币地址），所有交易信息公开透明。

​	•	**z-address**：受保护地址，使用 zk-SNARKs 技术对交易进行加密，确保交易的隐私性。

​	3.	**共识机制**

Zcash 使用 **工作量证明（Proof-of-Work, PoW）** 的共识机制，与比特币相似。网络中的矿工通过解决复杂的数学问题来验证交易并打包区块，从而确保区块链的安全性和去中心化。

​	4.	**区块奖励**

Zcash 的区块奖励按照比特币的模式进行逐步减少。最初的区块奖励为 12.5 ZEC，但每隔一段时间，奖励会减少，类似于比特币的 **减半（halving）** 机制。最终，Zcash 的总供应量将达到 2100 万 ZEC。

​	5.	**灵活的隐私保护**

Zcash 支持灵活的隐私保护设置，用户可以选择透明交易（t-address）或者受保护交易（z-address）。通过 **z-address**，用户的交易细节将被加密，这样可以保护用户的隐私。

​	6.	**可互操作性**

Zcash 是一个独立的区块链，但它也与比特币及其他加密货币保持一定的兼容性。例如，Zcash 支持通过类似比特币的交易结构进行跨链交易或与其他区块链的资产交换。

​	7.	**减半机制**

与比特币类似，Zcash 的区块奖励每四年（或每 840,000 个区块）减少一半，最终奖励将趋近于零，这样能确保货币总量的逐步减少。减半的目标是让 Zcash 的供应量控制在 2100 万个 ZEC。

---

## 2. 基本要求与技术实现

### 2.1 RPC URL（Open Node）
- 在线 RPC 服务商：
  - **getblock.io**: https://go.getblock.io/YOUR-API-KEY
  - **tatum.io**: https://tatum.io/

### 2.2 钱包 RPC 节点的搭建方式
搭建 RPC 节点可以通过以下几种方式：
- **自建节点**：
  - 下载安装区块链客户端: https://github.com/zcash/zcash
  - 配置节点并同步区块链数据。
  - 启动节点后，钱包可以通过本地 RPC 与区块链交互。
  - 搭建文档参考附录

### 2.3 Zcash链模型
- 经过区块浏览器及交易发送考证，典型**UTXO（Unspent Transaction Output）模型**

### 2.4 签名算法
- **Zcash链签名算法**：
  
  - **ECDSA**：T地址（透明地址）使用，Secp256k1
  - **EDDSA、ReDSA**：Z地址（隐私地址）使用，Sprout JoinSplit 版本使用EdD25519、Sapling升级使用ReDSA(与Schnorr和EdD25519类似)
  
  Transparent input signatures use ECDSA over the secp256k1 curve, as in Bitcoin.
  
  Sprout JoinSplit signatures use Ed25519 (as implemented in libsodium 1.0.15).
  
  Sapling spend authorization and binding signatures use RedDSA, a rerandomizable signature scheme similar to Schnorr and EdDSA, over the Jubjub curve.

### 2.5 代币精度
- 从比特币拓展而来，保持8位

### 2.6 共识机制
- **共识机制**是区块链网络中确定交易有效性的方式。
  - **PoW（Proof of Work）

#### 2.6.1 确认位
- **确认位**是指交易被多少个区块确认后，认为该交易已经完全确认。
  - 采用经验值原则，参考链最大回滚块数，币安为提现为15个区块确认到账，20区块确认可提现

#### 2.6.2 是否支持质押（POS 链支持质押）
- pow链，**不支持质押**

### 2.7 代币和 NFT（合约）
- 不支持。

### 2.8 是否支持 Tag/Memo
- **Tag/Memo**：不支持

### 2.9 是否为多链结构
- 非多链结构

### 2.10 地址生成方式

- 地址生成方式：

  - 在线生成地址：支持T地址与Z地址，使用rpc节点调用方式生成。

  - 离线生成地址：支持T地址生成

    ```typescript
    const seed = bip39.mnemonicToSeedSync(mnemonic, "")
    const masterKey = bip32.fromSeed(seed, network);
    const childKey = masterKey.derivePath(`m/44'/133'/0'/0/${addressIndex}`);
    const address = publicKeyToTransparentAddress(childKey.publicKey);
    return {
        privateKey: childKey.privateKey,
        publicKey: childKey.publicKey,
        address
    }
    ```

    

### 2.11 离线签名
- **离线签名**是指在没有连接网络的设备上进行交易签名，避免泄露私钥。
  - T地址支持离线签名
  
    ```typescript
    export function buildAndSignTx(params: {privateKey: string; signObj: any; network: string}): string {
        const {privateKey, signObj, network} = params;
        const builder = utxolib.bitgo.createTransactionBuilderForNetwork(network);
        signObj.inputs.forEach(input => {
            const script = utxolib.address.toOutputScript(input.address, network);
            builder.addInput(input.txid , input.vout,undefined, script,input.amount);
        })
        signObj.outputs.forEach(output => {
           const  outPublicKey = utxolib.address.toOutputScript(output.address, network);
            builder.addOutput(outPublicKey,output.amount);
        })
        const keyPair = utxolib.ECPair.fromWIF(privateKey);
        for (let i = 0; i < signObj.inputs.length; i++) {
            const signArg = {
                prevOutScriptType: 'p2pkh',
                vin: signObj.inputs[i].vout,
                keyPair: keyPair,
            };
            builder.sign(signArg);
        }
        const transaction = builder.build()
        return transaction.toHex()
    }
    ```

---

## 3. 扫链接口与交易解析

### 3.1 扫链的 RPC 接口
扫链是指通过 RPC 接口查询区块链交易、账户等信息。
#### 3.1.1 获取链上最高区块hash：`getbestblockhash`

- 参数：无
- 返回：返回最高区块hash，16进制	`{"result":"00000000012a76ec8ba1ecec6a53dbc80ba7e6ccb1c69e5064ed05bee5705944","error":null,"id":"curltest"}`

#### 3.1.2 根据hash获取区块信息：`getblock`

- 参数：`[00000000012a76ec8ba1ecec6a53dbc80ba7e6ccb1c69e5064ed05bee5705944]`

- 返回：区块高度height、交易列表tx等

  `{"result":{"hash":"00000000012a76ec8ba1ecec6a53dbc80ba7e6ccb1c69e5064ed05bee5705944","confirmations":298,"size":4040,"height":2828569,"version":4,"merkleroot":"a086c017b25d1f0c3a7012f5fe168bd212cee22295c78e329dee81de2f829b15","blockcommitments":"5f589fd10f39c350ea0e46b44558138eb081e1cfaebbaafa63ca5230c80948be","authdataroot":"53b4a52def3dc8a0893fafaa10a46bf527e939c009a5532e2e59f7b61a8b7888","finalsaplingroot":"049057c0542afd983640a78cfb29efa88ce76019296206ac48e34150e2afd50f","finalorchardroot":"17ed4a3329dab480f9fb5d52b540173bbb8f3ad75243d0f51d364dd5a71e953d","chainhistoryroot":"22d660be5b5fcd7f3e8e31584bef4c3137ee6be2cbe2b77f7eecde5be97184ff","tx":["5bff5ad090509500152ba076d10b2c69f59644b87c5042d84a5a270ed7c06ee2","d4b56e37afb970fd18c8322f3e49856d2ff87c97db259bbf50df7fc04a8fdbb6"],"time":1740061783,"nonce":"f7b30054000000000000000000170000000000000000000000000000fe920880","solution":"00d1655a221990fadd1825d494dfa9d97e91efe86e1409828236dac9df7c0ea357f63cf8d1de121a4d8e1b54f44b2f20ae1d3dda523d395a113fb5e65e63032c995ece3d3bee19f150066b64d60a16b66537dd9a1d4df95cc0d9ff1bb194070a7cf29bbe0f7fbd17261e3dfccd2bd12429220ee33773253b66c2b9bc9a611fa7ebd2ff9043f6f275d2746b9c12a73ebdff83a62482561f375dace3eab4c5ab0ed262e1ed9ccfadca02396a0315c15467d105e64b626fc09737bf1e5ac8446c86935ae212c3d93cc92380506bc39a249f7a410cc3791b5298915b338f241549a8f431dfa6f3918727d0d20887e2859b7b9064830cb980eaaab7d6dd9a0fec329e944bee3684717418ae3ac1ef23c67fdcb56ed0dfac66a6a289d9c057f44c7d116e6f1e1d6998118496b534a21dcd60faec15ad7d3ab32480ffe2fe326bb7d10ea251555816e49c20ac06517d8cfc9a00016f2669b15b4c17560391bafffc10d9f0c072adef05d4bccd88321795c111f32b52b4e23146c21af13312064521f8a8ae97c0a0a158526be797393f5d6f662c91456e65cdf1357bec9426eb4664310d108f129f023723def714d4113507811cffed4699ab32b8a2c22d24eed5b69933d7c24ed30f916b6eeaeb117b076507b443db6ac24bffea1215175be3ca8d69f6345521108e3aa1e4310b3fb5aa71331447e747dafb3ee7810841ddbfc2ac37b5932ef5e4d65e037e4d985c49480bb6bf0e22e3bcdfb5fb7bd5d56a640fdb72bfc08c1b7da73be369dbd7d0be64a1c85f3743a36eff0a132802444b2eef319bcb1144f0ed470a2d93b26dffb109c15f5aa4a3ce9746383280bd484a25f13650f3a71a535776e989223bb75c94bec32d016e31ee97636a1017526296f3eb37e35a53d44d2db852192518ac211b35dadbec98d5732893026f00d02815d5f95757280160faad9a93d954f355c45b6759572da9acf801570b6a6d053fc52223ff772300cc5f13a0c82c4c19ab04011d8c8aaf5c71e67ae118193b7f0163c6f681691d0f2ceb76734b39b6c94392dc480105693c9af31204f273a2cf0f01f8e15068c1ffdae692b8c63bab090b05a7db23c6cfe870f26a59036d1c0eb263fa1dd41aba395838daadbcddafa1b920d804b092a0fe786d2787324537e799c7f8580412a56ba6c160c47160f001b2cbae5497669b2b7b81fd0c28c8fe713014b48c20b7ff405a9606e7b5c59261db75dadf2482dedc5d083378fa3b873b73ade78464c96cd88e034b7b91cf2f68655a29d032e9ab78545700d8c49251e37fd7f1150684c16448e82cf45592ed4e6cc3cf4bf1bf442332f151a0681b61f1c484a428e6a798ae1bf9deb0dc1fc67a8e698c3a017a0b367d2dbf4b7282e6552af5356211aca2d6587979f053d2135134b2ceb81c99460556e188e467fe277e04441318338f62adfd1634970bf3ae22ab4c214863c232dbb845a725741f972361107d96cc3e5070ddab49a2ecc0ba31a587d5d2742610d6b4a400ccfba2b19d31c04f5ce79df511d5903a0c20879872472293c181a9d1d1e340b29dbafcd0103fc6fb75c52d83df9ac6e43103a9227230d67550a12360a6537c4c19c585b9e3b2d86bdddd26368b5287295d8c27e031ce49abd4733e491f7553b4353f558307238fd254729899b15b23a42ced723a68905f85db4de1761a677a257ff969b7902d6ee81e7e539674c611bd9f70cee40e0d2582b5be16d82c7613f7da2a5c1ccfe137864d8dfde09221ee28d29970b097526a080de6ba44f653953326c172cac970aaddcd4952c454144a62469d89e9589367523bf714d43ca4398961db11a156e5d41f54312f92053bcb364ae5dbeff7523e2659b7e64d1daa3f278aa378c73f70e23ddad576a0","bits":"1c019a10","difficulty":83791307.01295534,"chainwork":"00000000000000000000000000000000000000000000000013c3132dc8a2e80d","anchor":"8eeccfff52ee36712f6af5303858bf204555bd898eb546a195a2c77cbdea3c8a","chainSupply":{"monitored":true,"chainValue":15909272.04054480,"chainValueZat":1590927204054480,"valueDelta":1.56250000,"valueDeltaZat":156250000},"valuePools":[{"id":"transparent","monitored":true,"chainValue":13907385.60351518,"chainValueZat":1390738560351518,"valueDelta":3.12515000,"valueDeltaZat":312515000},{"id":"sprout","monitored":true,"chainValue":25824.36162510,"chainValueZat":2582436162510,"valueDelta":0.00000000,"valueDeltaZat":0},{"id":"sapling","monitored":true,"chainValue":845537.59931434,"chainValueZat":84553759931434,"valueDelta":-1.75015000,"valueDeltaZat":-175015000},{"id":"orchard","monitored":true,"chainValue":1111367.60109018,"chainValueZat":111136760109018,"valueDelta":0.00000000,"valueDeltaZat":0},{"id":"lockbox","monitored":true,"chainValue":19156.87500000,"chainValueZat":1915687500000,"valueDelta":0.18750000,"valueDeltaZat":18750000}],"trees":{"sapling":{"size":73742354},"orchard":{"size":49010660}},"previousblockhash":"00000000012139ba45c94dff0cd72c682c6a6aa01c282e01e6bdf5006fca5724","nextblockhash":"0000000001823228953e7af1d5e413098504bb96157b9b39711395bd298cd951"},"error":null,"id":"curltest"}`

#### 3.1.3 获取地址余额：`getaddressbalance`

- 参数：`["t1QzsGFr2iNTxNGAmhw2Nv8P85BG9XU31JJ"]`

- 结果：因隐私原因，获取失败，需在节点中开启该功能，自建节点可用

  `{"result":null,"error":{"code":-1,"message":"Error: getaddressbalance is disabled. Run './zcash-cli help getaddressbalance' for instructions on how to enable this feature."},"id":"curltest"}`

#### 3.1.4 获取地址UTXO：`getaddressutxos`

- 参数：`[{"addresses": ["t1QzsGFr2iNTxNGAmhw2Nv8P85BG9XU31JJ"], "chainInfo": true}] `、第二个参数为是否返回链信息

- 结果：因为隐私原因，公共节点不可用，需要节点中开启该功能，自建节点可用

  `{"result":null,"error":{"code":-1,"message":"Error: getaddressutxos is disabled. Run './zcash-cli help getaddressutxos' for instructions on how to enable this feature."},"id":"curltest"}`

#### 3.1.5 获取当前区块高度：`getblockcount`

- 参数：[]

- 结果：返回区块高度

  `{"result":2828594,"error":null,"id":"curltest"}`

- 发送交易：sendrawtransaction

  - 参数：16进制的签名后交易

  - 结果：返回交易hash

    `{"result":"0b7cd5c92ba5228f6160114b231fc64a74b664b66526938d16c823aa54b0ae43","error":null,"id":"curltest"}`

#### 3.1.6 根据交易hash获取交易详情：getrawtransaction

- 参数：交易hash和是否解码

  ["5b0191406c2ffa0fc7fe5af68c53c41ab5aa6012a1b619b3c8376911957883da", 1]

- 结果：返回json格式的解码后的交易内容，包括txid、vin、vout、解锁脚本等信息

  `{"result":{"hex":"0400008085202f8901e279f27893af683f19cba0016f59a2a1939d25e659850c57f9398276794bc304010000006a47304402207b1b38327c344a5fbb6e06e58752bb6cc4ac79e6e8db13028a527784666ad7040220253eff0a04a8d601887f66522c0c59c01534fafe3de42e77ca60543d1dba94d101210294e95e927508f6a6cde79a068358b90b10a1c6bf9d3a61f0e711c945efa3bd59ffffffff0224fa4000000000001976a9144e28874147ce07c0d2b9463d34567d833017a4db88ac748f0900000000001976a9143baf2c65ae0c9171d40b988df1459ebee092224b88ac00000000000000000000000000000000000000","txid":"5b0191406c2ffa0fc7fe5af68c53c41ab5aa6012a1b619b3c8376911957883da","authdigest":"ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","size":244,"overwintered":true,"version":4,"versiongroupid":"892f2085","locktime":0,"expiryheight":0,"vin":[{"txid":"04c34b79768239f9570c8559e6259d93a1a2596f01a0cb193f68af9378f279e2","vout":1,"scriptSig":{"asm":"304402207b1b38327c344a5fbb6e06e58752bb6cc4ac79e6e8db13028a527784666ad7040220253eff0a04a8d601887f66522c0c59c01534fafe3de42e77ca60543d1dba94d1[ALL] 0294e95e927508f6a6cde79a068358b90b10a1c6bf9d3a61f0e711c945efa3bd59","hex":"47304402207b1b38327c344a5fbb6e06e58752bb6cc4ac79e6e8db13028a527784666ad7040220253eff0a04a8d601887f66522c0c59c01534fafe3de42e77ca60543d1dba94d101210294e95e927508f6a6cde79a068358b90b10a1c6bf9d3a61f0e711c945efa3bd59"},"sequence":4294967295}],"vout":[{"value":0.04258340,"valueZat":4258340,"valueSat":4258340,"n":0,"scriptPubKey":{"asm":"OP_DUP OP_HASH160 4e28874147ce07c0d2b9463d34567d833017a4db OP_EQUALVERIFY OP_CHECKSIG","hex":"76a9144e28874147ce07c0d2b9463d34567d833017a4db88ac","reqSigs":1,"type":"pubkeyhash","addresses":["t1QzsGFr2iNTxNGAmhw2Nv8P85BG9XU31JJ"]}},{"value":0.00626548,"valueZat":626548,"valueSat":626548,"n":1,"scriptPubKey":{"asm":"OP_DUP OP_HASH160 3baf2c65ae0c9171d40b988df1459ebee092224b OP_EQUALVERIFY OP_CHECKSIG","hex":"76a9143baf2c65ae0c9171d40b988df1459ebee092224b88ac","reqSigs":1,"type":"pubkeyhash","addresses":["t1PKBiv7mtzD9bNafYaqyxaENeiNDbpKxxQ"]}}],"vjoinsplit":[],"valueBalance":0.00000000,"valueBalanceZat":0,"vShieldedSpend":[],"vShieldedOutput":[],"blockhash":"0000000001d266a96390aff3f4ddb25af02b8aee70d54e578a337ea606a4372e","height":2828559,"confirmations":276,"time":1740061235,"blocktime":1740061235},"error":null,"id":"curltest"}`

#### 3.1.7 解码交易: `decoderawtransaction`

- 参数：交易离线签名后的16进制串

  `["0400008085202f8901da837895116937c8b319b6a11260aab51ac4538cf65afec70ffa2f6c4091015b000000006b483045022100afc3a5c70bfce5bc3601385cf8b79dc5430db2851cb1dcaec428728925d6d1e102203c1086b651cdf3784254f96c3e464e0d7bcf6da11c5ef2aa87016548a54489290121036e418e6b13e19614d67e281d2635fff7fa5e5d6e10eb6ed03d59dd3fd570ad5cffffffff0280841e00000000001976a914924e352f887f6fdf46d3153fbc5124b5ad3f902988ac80841e00000000001976a914924e352f887f6fdf46d3153fbc5124b5ad3f902988ac00000000000000000000000000000000000000"]`

- 结果：返回json格式解码后的内容

  ​	`{"result":{"txid":"091143a62d1b7968e1d9f6867343bcec913785777a6d4439a153871bbe52773e","authdigest":"ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","size":245,"overwintered":true,"version":4,"versiongroupid":"892f2085","locktime":0,"expiryheight":0,"hex":"0400008085202f8901da837895116937c8b319b6a11260aab51ac4538cf65afec70ffa2f6c4091015b000000006b483045022100a1346718885adfd6ab6a527bcb3255f9f425392f99c3486eda3a6a5c0060afd502201202b2db8cdbbcdd74bdfe976f9670af122779fcd79f3b3a335221a7d5effc210121036e418e6b13e19614d67e281d2635fff7fa5e5d6e10eb6ed03d59dd3fd570ad5cffffffff02a0860100000000001976a914cdf701a79db78a495a1cbc1cdf99d81d93ca17f588ac400d0300000000001976a914cdf701a79db78a495a1cbc1cdf99d81d93ca17f588ac00000000000000000000000000000000000000","vin":[{"txid":"5b0191406c2ffa0fc7fe5af68c53c41ab5aa6012a1b619b3c8376911957883da","vout":0,"scriptSig":{"asm":"3045022100a1346718885adfd6ab6a527bcb3255f9f425392f99c3486eda3a6a5c0060afd502201202b2db8cdbbcdd74bdfe976f9670af122779fcd79f3b3a335221a7d5effc21[ALL] 036e418e6b13e19614d67e281d2635fff7fa5e5d6e10eb6ed03d59dd3fd570ad5c","hex":"483045022100a1346718885adfd6ab6a527bcb3255f9f425392f99c3486eda3a6a5c0060afd502201202b2db8cdbbcdd74bdfe976f9670af122779fcd79f3b3a335221a7d5effc210121036e418e6b13e19614d67e281d2635fff7fa5e5d6e10eb6ed03d59dd3fd570ad5c"},"sequence":4294967295}],"vout":[{"value":0.00100000,"valueZat":100000,"valueSat":100000,"n":0,"scriptPubKey":{"asm":"OP_DUP OP_HASH160 cdf701a79db78a495a1cbc1cdf99d81d93ca17f5 OP_EQUALVERIFY OP_CHECKSIG","hex":"76a914cdf701a79db78a495a1cbc1cdf99d81d93ca17f588ac","reqSigs":1,"type":"pubkeyhash","addresses":["t1ceeRyG2EU3d5cWNoYEMQH8FASEj7AYrWa"]}},{"value":0.00200000,"valueZat":200000,"valueSat":200000,"n":1,"scriptPubKey":{"asm":"OP_DUP OP_HASH160 cdf701a79db78a495a1cbc1cdf99d81d93ca17f5 OP_EQUALVERIFY OP_CHECKSIG","hex":"76a914cdf701a79db78a495a1cbc1cdf99d81d93ca17f588ac","reqSigs":1,"type":"pubkeyhash","addresses":["t1ceeRyG2EU3d5cWNoYEMQH8FASEj7AYrWa"]}}],"vjoinsplit":[],"valueBalance":0.00000000,"valueBalanceZat":0,"vShieldedSpend":[],"vShieldedOutput":[]},"error":null,"id":"curltest"}`

#### 3.1.8 获取交易内存池信息（预估手续费）：

- 一般来说，预估手续费采取发送的 （vin字节数+vout字节数）x费率x倍率去计算

- 参数：true控制返回json格式数据

  [true]

- 结果：其中fee字段交易总费用，size为交易字节数，计算费率可采用fee/size

  `{"result":{"8ca61e8a50a1a04835267bbc780c95c78f86188abeb426b55dc02f97f8c990a9":{"size":245,"fee":0.00010000,"modifiedfee":0.00010000,"time":1740131206,"height":2829477,"descendantcount":1,"descendantsize":245,"descendantfees":10000,"depends":[]},"9d38d2fdc3150774306fc0dc825e41dddfd78947b6d0445b289d3e184fae8cde":{"size":245,"fee":0.00011300,"modifiedfee":0.00011300,"time":1740131229,"height":2829477,"descendantcount":1,"descendantsize":245,"descendantfees":11300,"depends":[]}},"error":null,"id":"curltest"}`



---

## 4. 参考文献
- [Zcash 官方网站](https://z.cash/)
- [Zcash 官方文档站](https://zcash.readthedocs.io/en/latest/)
- [区块浏览器1](https://blockchair.com/zcash)
- [区块浏览器2](https://blockexplorer.one/zcash/mainnet)
- [Zcash RPC接口文档](https://zcash.github.io/rpc/)
- [三方RPC节点1](https://account.getblock.io/)
- [三方RPC节点2](https://tatum.io/)
- [自建RPC指南](https://zcash.readthedocs.io/en/latest/rtd_pages/zcashd.html)