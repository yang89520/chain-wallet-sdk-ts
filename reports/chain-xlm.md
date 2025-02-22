#### RPC DOC
- https://developers.stellar.org/docs/data/rpc/admin-guide

　

---------------------------------------------------------------------------------

　

#### 官方钱包
- 官方钱包: 无
- 合作钱包: Balance Wallet，Trust Wallet 等

　

---------------------------------------------------------------------------------

　

#### 浏览器 
- https://stellarchain.io/

　

---------------------------------------------------------------------------------

　

#### 账户模型 与 UTXO模型
- Account模型
- 浏览器中，查看单笔交易，明显有看到Account、Balance

　

---------------------------------------------------------------------------------

　

#### 签名算法
- ed25519
- 源码线索：Process-wide global Ed25519 signature-verification cache.

　

---------------------------------------------------------------------------------

　

#### 原生代币精度
- 最大货币名称：XLM
- 最小货币名称：stroops
- 浏览器中，用户余额可以精确到小数点后7位。
- 源码中，关键词查找：```decimal```或```= 7``` 没有找到有效信息
- 源码中，关键词查找：```10000000```有找到创建账户的片段代码 ```createAccounts```，能看到货币精度为 7
```
    TxGenerator::createAccounts(uint64_t start, uint64_t count, uint32_t ledgerNum, bool initialAccounts)
    {
        vector<Operation> ops;
        SequenceNumber sn = static_cast<SequenceNumber>(ledgerNum) << 32;
        auto balance = initialAccounts ? mMinBalance * 10000000 : mMinBalance * 100;
        for (uint64_t i = start; i < start + count; i++)
        {
            auto name = "TestAccount-" + to_string(i);
            auto account = TestAccount{mApp, txtest::getAccount(name.c_str()), sn};
            ops.push_back(txtest::createAccount(account.getPublicKey(), balance));

            // Cache newly created account
            auto acc = make_shared<TestAccount>(account);
            mAccounts.emplace(i, acc);
        }
        return ops;
    }
```

　

---------------------------------------------------------------------------------

　
#### 共识机制
- The Stellar network reaches consensus using the Stellar Consensus Protocol (SCP), which is a construction of the Federated Byzantine Agreement (FBA). FBA differs from other well-known consensus mechanisms like Proof of Work (which relies on a node’s computational power) and Proof of Stake (which relies on a node’s staking power) by instead relying on the agreement of trusted nodes.
- Stellar 网络使用 Stellar 共识协议 （SCP） 达成共识，该协议是联邦拜占庭协议 （FBA） 的一种构建。FBA 与其他众所周知的共识机制不同，如工作量证明（依赖于节点的计算能力）和权益证明（依赖于节点的质押能力），它依赖于受信任节点的协议。 

　

---------------------------------------------------------------------------------


#### 确认位
- 交易一旦被投票通过，就达成共识，不可逆转了。即，确认位 可认定为 1
- 没有明确的质押机制。

　

---------------------------------------------------------------------------------

　

#### 是否支持 代币和 NFT(合约) 
- 不支持复杂合约，但支持 Token 与 NFT

　

---------------------------------------------------------------------------------

　

#### 是否支持 Tag/Memo
- 是的
- 源码线索查找，如下：
```
    void setMemo(TransactionTestFramePtr tx, Memo memo)
    {
        auto& env = tx->getMutableEnvelope();
        Memo& m =
            env.type() == ENVELOPE_TYPE_TX_V0 ? env.v0().tx.memo : env.v1().tx.memo;
        m = memo;
    }
```

　

---------------------------------------------------------------------------------

　

#### 是否支持 多链结构
- 不支持
- 浏览器完全没有多链的模块。

　

---------------------------------------------------------------------------------

　

#### 离线地址生成
```
export function createAddress(seedHex: string, accountIndex: string) {
    const keyData = HDKey.derivePath(`m/44'/148'/${accountIndex}'`, seedHex).key;
    const key = Keypair.fromRawEd25519Seed(keyData)
    return {
        publicKey : key.publicKey(),
        privateKey : key.secret()
    }
}
```

#### 离线签名
```
export async function signTransaction(params: any) {
    const { sourcePrivateKey, destinationAddress, amount, sequence, memo, isTestnet } = params;
    const targetNetwork = isTestnet ? Networks.TESTNET: Networks.PUBLIC

    const keyPair = Keypair.fromSecret(sourcePrivateKey)
    const sourceAccount = new Account(keyPair.publicKey(), sequence.toString());

    let amountString = amount.toString()
    let assetType = Asset.native()
    let signer = Keypair.master(targetNetwork);

    const tx = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        memo: memo,
        networkPassphrase :targetNetwork
    })
    .addOperation(
        Operation.payment({
            amount : amountString,
            asset : assetType,
            destination: destinationAddress
        })
        )
        .setTimeout(TimeoutInfinite)
        .build()
    //tx.sign(signer)
    tx.sign(keyPair)

    let env = tx.toEnvelope().value();
    let rawSig = env.signatures()[0].signature();
    myLogger.logInfo(`(Error: invalid_xdr) rawSig -> ${rawSig.toString('hex')}`)

    let rawSig_xdr = tx.toXDR();
    myLogger.logInfo(`(Error，Near)rawSig_xdr -> ${rawSig_xdr}`)

    let rawSig_xdr_ba64 = tx.toEnvelope().toXDR().toString('base64');
    myLogger.logInfo(`rawSig_xdr_ba64 -> ${rawSig_xdr_ba64}`)

    //return "signs correctly"
}
```

　

---------------------------------------------------------------------------------

　

#### 扫链的 RPC 接口
#### 获取最新账本基础信息
```
// Request
{
  "jsonrpc": "2.0",
  "id": 8675309,
  "method": "getLatestLedger"
}

// Result
{
  "jsonrpc": "2.0",
  "id": 8675309,
  "result": {
    "id": "c73c5eac58a441d4eb733c35253ae85f783e018f7be5ef974258fed067aabb36",
    "protocolVersion": 20,
    "sequence": 2539605
  }
}
```
#### 获取指定账本的信息
```
// Request
{
  "jsonrpc": "2.0",
  "id": 8675309,
  "method": "getLedgerEntries",
  "params": {
    "keys": [
      "AAAABgAAAAHMA/50/Q+w3Ni8UXWm/trxFBfAfl6De5kFttaMT0/ACwAAABAAAAABAAAAAgAAAA8AAAAHQ291bnRlcgAAAAASAAAAAAAAAAAg4dbAxsGAGICfBG3iT2cKGYQ6hK4sJWzZ6or1C5v6GAAAAAE="
    ]
  }
}

// Result
{
  "jsonrpc": "2.0",
  "id": 8675309,
  "result": {
    "entries": [
      {
        "key": "AAAAB+qfy4GuVKKfazvyk4R9P9fpo2n9HICsr+xqvVcTF+DC",
        "xdr": "AAAABgAAAAAAAAABzAP+dP0PsNzYvFF1pv7a8RQXwH5eg3uZBbbWjE9PwAsAAAAQAAAAAQAAAAIAAAAPAAAAB0NvdW50ZXIAAAAAEgAAAAAAAAAAIOHWwMbBgBiAnwRt4k9nChmEOoSuLCVs2eqK9Qub+hgAAAABAAAAAwAAAAw=",
        "lastModifiedLedgerSeq": 2552504
      }
    ],
    "latestLedger": 2552990
  }
}
```
#### 获取批量的账本信息
```
// Request
{
  "jsonrpc": "2.0",
  "id": 8675309,
  "method": "getLedgers",
  "params": {
    "startLedger": 36233,
    "pagination": {
      "limit": 2
    }
  }
}

// Result
{
  "jsonrpc": "2.0",
  "id": 8675309,
  "result": {
    "ledgers": [
      {
        "hash": "434de11b427aa4b6f8cda259ac2111a6aa148d2ab6b4c7affe864e94a9f4bd80",
        "sequence": 36233,
        "ledgerCloseTime": "1734032457",
        "headerXdr": "Q03hG0J6pLb4zaJZrCERpqoUjSq2tMev/oZOlKn0vYAAAAAWY6AkQmSfV+Rrnpq308LrTR1IZq7dUQr4HkNPlpDpw4/4WH/HGddpIrl1KZiCUKzFOi9sqkX+b56aTGNqhTRHtwAAAABnWzxJAAAAAAAAAAEAAAAAqCTNGLyddQZNKZpbW6ykO8OqLzJpOBU9jC+btctt8DMAAABAjksBzacOp2IR06utjCmZ0QR6kgidREHCceghZapmZdNrS1uBiBG8Zz5Eh7uxMga5IAHPVbkSgFgXzjwRk4i2At8/YZgEqS/bQFcZLcQ910jqd4rcUrxJjOgFJMAUuBEZkxHVMCvc1iIZj7nTD2d91KT24H9FpOIGJLSiTuwys+0AAI2JDeC2s6dkAAAAAAAIewDXaQAAAAAAAAAAAAAB3wAAAGQATEtAAAAAyESlcNBlpidDCvLHH8Nu1MWDHWwUXTfbvGKqvbvlzzrb2GJe+2UfU8rr8mWrJXRTcQhl5UYgKhOQUOWP1nWgbp4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        "metadataXdr": "AAAAAQAAAABDTeEbQnqktvjNolmsIRGmqhSNKra0x6/+hk6UqfS9gAAAABZjoCRCZJ9X5GuemrfTwutNHUhmrt1RCvgeQ0+WkOnDj/hYf8cZ12kiuXUpmIJQrMU6L2yqRf5vnppMY2qFNEe3AAAAAGdbPEkAAAAAAAAAAQAAAACoJM0YvJ11Bk0pmltbrKQ7w6ovMmk4FT2ML5u1y23wMwAAAECOSwHNpw6nYhHTq62MKZnRBHqSCJ1EQcJx6CFlqmZl02tLW4GIEbxnPkSHu7EyBrkgAc9VuRKAWBfOPBGTiLYC3z9hmASpL9tAVxktxD3XSOp3itxSvEmM6AUkwBS4ERmTEdUwK9zWIhmPudMPZ33UpPbgf0Wk4gYktKJO7DKz7QAAjYkN4Lazp2QAAAAAAAh7ANdpAAAAAAAAAAAAAAHfAAAAZABMS0AAAADIRKVw0GWmJ0MK8scfw27UxYMdbBRdN9u8Yqq9u+XPOtvYYl77ZR9TyuvyZasldFNxCGXlRiAqE5BQ5Y/WdaBungAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFjoCRCZJ9X5GuemrfTwutNHUhmrt1RCvgeQ0+WkOnDjwAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADVBewAAAAAAAAAAA=="
      },
      {
        "hash": "201f38ca43cfad09d00287ee70d77edc8c88a61e018683fd466e71688222a217",
        "sequence": 36234,
        "ledgerCloseTime": "1734032462",
        "headerXdr": "IB84ykPPrQnQAofucNd+3IyIph4BhoP9Rm5xaIIiohcAAAAWQ03hG0J6pLb4zaJZrCERpqoUjSq2tMev/oZOlKn0vYB8UE9ZJ4uLDnIu/g7+08D/eYnJjrJD07fGpWaVoLi29wAAAABnWzxOAAAAAAAAAAEAAAAAtV0Qsrt9KE7VwDpHpeG1kMkPV4NVRxzEUHu+ggTSPIsAAABAN6Cc3KxXPM2WmFDtY/yPZM0aha2yhnHFBDaliMqO6BzVQMb9Zlq5DoGrLr/xoFOp8YJ3RjLedF8w/KfN3ogPBuzRjPABveSt1CvvmDdnwUpSXyUsjdjECdbpjuKxaZZR+NeVPfeYT06qs2v4JwBff4WWpIGwEXPcxq3tZKuekH8AAI2KDeC2s6dkAAAAAAAIewDaiQAAAAAAAAAAAAAB3wAAAGQATEtAAAAAyESlcNBlpidDCvLHH8Nu1MWDHWwUXTfbvGKqvbvlzzrb2GJe+2UfU8rr8mWrJXRTcQhl5UYgKhOQUOWP1nWgbp4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        "metadataXdr": "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"
      }
    ],
    "latestLedger": 36379,
    "latestLedgerCloseTime": 1734033188,
    "oldestLedger": 29312,
    "oldestLedgerCloseTime": 1733997822,
    "cursor": "36234"
  }
}
```
#### 获取节点的健康度
```
// Request
{
  "jsonrpc": "2.0",
  "id": 8675309,
  "method": "getHealth"
}

// Result
{
  "jsonrpc": "2.0",
  "id": 8675309,
  "result": {
    "status": "healthy",
    "latestLedger": 51583040,
    "oldestLedger": 51565760,
    "ledgerRetentionWindow": 17281
  }
}
```
#### 发送交易
```
// Request
{
  "jsonrpc": "2.0",
  "id": 8675309,
  "method": "sendTransaction",
  "params": {
    "transaction": "AAAAAgAAAAAg4dbAxsGAGICfBG3iT2cKGYQ6hK4sJWzZ6or1C5v6GAAAAGQAJsOiAAAADQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAACgAAAAVIZWxsbwAAAAAAAAEAAAAMU29yb2JhbiBEb2NzAAAAAAAAAAELm/oYAAAAQATr6Ghp/DNO7S6JjEFwcJ9a+dvI6NJr7I/2eQttvoovjQ8te4zKKaapC3mbmx6ld6YKL5T81mxs45TjzdG5zw0="
  }
}

// Result
{
  "jsonrpc": "2.0",
  "id": 8675309,
  "result": {
    "status": "PENDING",
    "hash": "d8ec9b68780314ffdfdfc2194b1b35dd27d7303c3bceaef6447e31631a1419dc",
    "latestLedger": 2553978,
    "latestLedgerCloseTime": "1700159337"
  }
}
```
#### 模拟发送交易
```
// Request
{
  "jsonrpc": "2.0",
  "id": 8675309,
  "method": "simulateTransaction",
  "params": {
    "transaction": "AAAAAgAAAAAg4dbAxsGAGICfBG3iT2cKGYQ6hK4sJWzZ6or1C5v6GAAAAGQAJsOiAAAAEQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGAAAAAAAAAABzAP+dP0PsNzYvFF1pv7a8RQXwH5eg3uZBbbWjE9PwAsAAAAJaW5jcmVtZW50AAAAAAAAAgAAABIAAAAAAAAAACDh1sDGwYAYgJ8EbeJPZwoZhDqEriwlbNnqivULm/oYAAAAAwAAAAMAAAAAAAAAAAAAAAA=",
    "resourceConfig": {
      "instructionLeeway": 3000000
    }
  }
}

// Result
{
  "jsonrpc": "2.0",
  "id": 8675309,
  "result": {
    "transactionData": "AAAAAAAAAAIAAAAGAAAAAcwD/nT9D7Dc2LxRdab+2vEUF8B+XoN7mQW21oxPT8ALAAAAFAAAAAEAAAAHy8vNUZ8vyZ2ybPHW0XbSrRtP7gEWsJ6zDzcfY9P8z88AAAABAAAABgAAAAHMA/50/Q+w3Ni8UXWm/trxFBfAfl6De5kFttaMT0/ACwAAABAAAAABAAAAAgAAAA8AAAAHQ291bnRlcgAAAAASAAAAAAAAAAAg4dbAxsGAGICfBG3iT2cKGYQ6hK4sJWzZ6or1C5v6GAAAAAEAHfKyAAAFiAAAAIgAAAAAAAAAAw==",
    "minResourceFee": "90353",
    "events": [
      "AAAAAQAAAAAAAAAAAAAAAgAAAAAAAAADAAAADwAAAAdmbl9jYWxsAAAAAA0AAAAgzAP+dP0PsNzYvFF1pv7a8RQXwH5eg3uZBbbWjE9PwAsAAAAPAAAACWluY3JlbWVudAAAAAAAABAAAAABAAAAAgAAABIAAAAAAAAAACDh1sDGwYAYgJ8EbeJPZwoZhDqEriwlbNnqivULm/oYAAAAAwAAAAM=",
      "AAAAAQAAAAAAAAABzAP+dP0PsNzYvFF1pv7a8RQXwH5eg3uZBbbWjE9PwAsAAAACAAAAAAAAAAIAAAAPAAAACWZuX3JldHVybgAAAAAAAA8AAAAJaW5jcmVtZW50AAAAAAAAAwAAAAw="
    ],
    "results": [
      {
        "auth": [],
        "xdr": "AAAAAwAAAAw="
      }
    ],
    "cost": {
      "cpuInsns": "1635562",
      "memBytes": "1295756"
    },
    "latestLedger": 2552139
  }
}
```



---------------------------------------------------------------------------------

　

#### 附录
- 官网：https://stellar.org/
- 官方实验室：https://lab.stellar.org/
- 官方实验室模拟操作： https://lab.stellar.org/transaction/build?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&transaction$build$classic$operations@$operation_type=&params@;;
- 仓库：https://github.com/stellar/
- PRC test：https://soroban-testnet.stellar.org
- PRC test：https://silent-fabled-replica.stellar-testnet.quiknode.pro/5dbd1eadc3a6ad41f5e2f5deb72e8ab514bf2b40
- PRC main：https://thrilling-shy-sky.stellar-mainnet.quiknode.pro/d47047130637d0acb7029b8d21ae7ac4fb24bdd0

