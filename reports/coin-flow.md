FLOW链的报告

```
- 相关链接
rpc接口文档：
	https://developers.flow.com/http-api
开发文档:
	https://findonflow.github.io/findlabs-api/#operation/getBlockByHeight
浏览器:
	https://www.flowscan.io/

```

```
- RPC URL(open node)
	主网:https://rest-mainnet.onflow.org/v1/
	测试网:https://rest-testnet.onflow.org/v1/events
```

```
- 账户模型还是 UTXO: 账户模型

- 钱包 RPC 节点的搭建方式: //todo

- 签名算法: ECDSA_secp256k1, ECDSA_P256 两种

- 哈希算法: sha256,sha3_256

- 代币精度: decimals: 8

- 共识机制: pos
    - 确认位   欧意是:120
    - 是否支持质押 支持
    
- 是否支持 Tag/Memo: 不支持

- 是否为多链结构: 不是

- 离线地址生成方式: 不支持公钥直接生成地址，需要通过创建账户的交易发到区块链网络上，使用区块链网络给公钥分配绑定地址

```

```typescript
- 离线签名: 
export const transactionSignature = (msg: string, privateKey: Buffer,hash:string,encrypt:string): string => {
  const messageForHash = utils.fromHex(TX_DOMAIN_TAG_HEX + msg);
  //选择哈希算法 sha256或者sha3_256
  let digest= sha3_256(messageForHash);
  if(hash=="sha256"){
    digest=sha256(messageForHash);
  }
  //选择加密算法ECDSA_Secp256k1或ECDSA_P256
  let sig = secp256k1.ecdsaSign(Buffer.from(digest), privateKey);
  if(encrypt=="ECDSA_P256"){
    sig = secp256k1.ecdsaSign(Buffer.from(digest), privateKey);
  }
  return utils.toHex(sig.signature);
};
```

```
- 扫链的 RPC 接口
  接口文档:https://developers.flow.com/http-api#tag/

- 获取区块的接口
	https://rest-mainnet.onflow.org/v1/blocks

- 根据id获取区块
	https://rest-mainnet.onflow.org/v1/blocks/{id}
	
- 根据id获取交易
    https://rest-mainnet.onflow.org/v1/transactions/{id}
    
- 发送交易
	https://rest-mainnet.onflow.org/v1/transactions
	
	request Payload:
    {
      "script": "string",
      "arguments": [
        "string"
      ],
      "reference_block_id": "string",
      "gas_limit": "string",
      "payer": "string",
      "proposal_key": {
        "address": "string",
        "key_index": "string",
        "sequence_number": "string"
      },
      "authorizers": [
        "string"
      ],
      "payload_signatures": [
        {
          "address": "string",
          "key_index": "string",
          "signature": "string"
        }
      ],
      "envelope_signatures": [
        {
          "address": "string",
          "key_index": "string",
          "signature": "string"
        }
      ]
    }
    response:
      {
      "id": "string",
      "script": "string",
      "arguments": [
        "string"
      ],
      "reference_block_id": "string",
      "gas_limit": "string",
      "payer": "string",
      "proposal_key": {
        "address": "string",
        "key_index": "string",
        "sequence_number": "string"
      },
      "authorizers": [
        "string"
      ],
      "payload_signatures": [
        {
          "address": "string",
          "key_index": "string",
          "signature": "string"
        }
      ],
      "envelope_signatures": [
        {
          "address": "string",
          "key_index": "string",
          "signature": "string"
        }
      ],
      "result": {
        "block_id": "string",
        "collection_id": "string",
        "execution": "Pending",
        "status": "Pending",
        "status_code": 0,
        "error_message": "string",
        "computation_used": "string",
        "events": [
          {
            "type": "string",
            "transaction_id": "string",
            "transaction_index": "string",
            "event_index": "string",
            "payload": "string"
          }
        ],
        "_links": {
          "_self": "string"
        }
      },
      "_expandable": {
        "result": "http://example.com"
      },
      "_links": {
        "_self": "string"
      }
    }

- 获取账户的详情
	https://rest-mainnet.onflow.org/v1/accounts/{address}
	response:
	{
      "address": "string",
      "balance": "string",
      "keys": [
        {
          "index": "string",
          "public_key": "string",
          "signing_algorithm": "BLSBLS12381",
          "hashing_algorithm": "SHA2_256",
          "sequence_number": "string",
          "weight": "string",
          "revoked": true
        }
      ],
      "contracts": {
        "property1": "string",
        "property2": "string"
      },
      "_expandable": {
        "keys": "string",
        "contracts": "string"
      },
      "_links": {
        "_self": "string"
      }
    }
    
    
- 扫链回来的交易的解析
	

- 扫链回来的交易手续费的计算
    Flow链的交易手续费是动态计算的，主要由三部分组成：执行费（Execution Fee）、打包费（Inclusion Fee）和网络激增系数			（Surge Factor）。
    1. 执行费（Execution Fee）
    执行费是根据交易的执行工作量计算的，与交易中涉及的操作复杂性有关。执行工作量分为以下几类：
    Cadence代码执行（如循环、函数调用）。
    从存储器读取数据（按字节计费）。
    向存储器写入数据（按字节计费）。
    账户创建。
    目前，单位执行成本为 4.99E-08 FLOW。
    2. 打包费（Inclusion Fee）
    打包费是将交易打包到区块中的成本，目前固定为 1E-6 FLOW。未来，打包费可能会根据交易的字节大小和签名数量动态调整。
    3. 网络激增系数（Surge Factor）
    网络激增系数用于动态调整交易费用，以反映当前网络的负载情况。目前，激增系数固定为 1.0，但未来可能会根据网络拥堵情况动态调整。
    交易手续费的计算公式
    最终的交易手续费计算公式为：
    总手续费 = （打包费 + 执行费） × 网络激增系数
    或：
    总手续费 = (打包工作量 × 单位打包成本 + 执行工作量 × 单位执行成本) × 网络激增系数
    常见交易类型的手续费
    以下是一些常见交易类型的估计费用：
    交易类型估计费用（FLOW）同质化代币转账0.00000185铸造小型 NFT0.0000019创建账户0.00000315部署50KB智能合约0.00002965
    这些费用会根据交易的复杂性和网络状态动态变化。
    如果需要更详细的费用估算，可以参考Flow官方文档或社区提出的FLIP（Flow Improvement Proposals）。
```



