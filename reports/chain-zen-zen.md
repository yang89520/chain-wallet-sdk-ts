## zen-chain 接入调研
zen正处在[Horizen 2.0 migration](https://www.horizen.io/horizen-upgrade) 升级中.目前,horizen[官网](https://www.horizen.io/)不提供pow链(zen)的文档,接口文档等,此调研来源于github上HorizenOfficial的代码库 zen,zencashjs,arizen
## 一.链的特性
### 账户模型还是 UTXO
UTXO->[zen代码库](https://github.com/HorizenOfficial/zen/blob/main/src/main.h#L465) 
### 签名算法
[secp256k1 ecdsa](https://github.com/HorizenOfficial/zen/blob/main/src/secp256k1/include/secp256k1.h#L68)
### 代币精度
8->[zen代码库](https://github.com/HorizenOfficial/zen/blob/main/src/amount.h#L18)
### 共识机制
[pow](https://github.com/HorizenOfficial/zen/blob/main/src/pow.h#L6)
#### 确认位
建议提币确认位:
- 80 block * 2.5min(1block) = 200min

历史最长回滚长度:2018年6月3日 [38个回滚](https://www.horizen.io/academy/zencash-to-horizen/#the-51-attack-and-a-solution-to-it)

参考值
币安提币block:80

#### 是否支持质押，POS 链是支持质押
否
### 是否支持代币和 NFT(合约)
否
### 质押的方式
无
### 是否支持 Tag/Memo
不支持
### 是否为多链结构
主链为 zen
侧链有 eon zenchain 等
## 二.离线地址生成
官方没给正在使用的助记词到seed的过程,参考archive的 zencash-mobile版本写了一个,原版只使用了助记词的前64个字符,不安全,实用价值也很低 https://github.com/HorizenOfficial/zencash-mobile/blob/master/src/utils/wallet.js#L9

还有一个官方的钱包 arizen,不过没用助记词生成seed的模式,用的是用户的password加盐hash生成seed,用户名和密码本地保存成 .awd文件:  https://github.com/HorizenOfficial/arizen/blob/master/app/main.js#L303

还有一个官方的钱包 sphere,用了助记词生成seed,不过没开源,只给了下载方式: https://github.com/HorizenOfficial/Sphere_by_Horizen

### 离线地址生成方式
## 三.离线签名
## 四.扫链的 RPC 接口解析
**rpc节点地址**
- https://explorer.horizen.global/api

**rpc节点接口文档:**
- https://github.com/HorizenOfficial/insight-api-zen

**超级节点列表:**
- https://supernodes1.eu.zensystem.io/
- https://supernodes2.eu.zensystem.io/
- https://supernodes1.na.zensystem.io/
- https://supernodes2.na.zensystem.io/

### 扫链的 RPC 接口
#### rosetta格式接口 //TODO
#### api接口
##### cex用
1.检查节点是否已同步

GET Request
```
curl --location 'https://explorer.horizen.global/api/sync' \
--data ''
```
Response
```
{
    "status": "finished",
    "blockChainHeight": 1721522,
    "syncPercentage": 100,  //检查这个
    "height": 1721522,
    "error": null,
    "type": "bitcore node"
}
```

2.获取最新区块号

GET Request
```
curl --location 'https://explorer.horizen.global/api/status?q=getInfo' \
--data ''
```
Response
```
{
    "info": {
        "version": 5000550,
        "protocolversion": 170002,
        "blocks": 1721528,  //区块号
        "timeoffset": 0,
        "connections": 16,
        "proxy": "",
        "difficulty": 42585493.3890032,
        "testnet": false,
        "relayfee": 0.000001,
        "errors": "",
        "network": "livenet"
    }
}
```

3.根据区块号获取区块hash

GET Request
```
curl --location 'https://explorer.horizen.global/api/block-index/1721528' \
--data ''
```
Response
```
{
    "blockHash": "0000000000c585390812c441fe3b23c8cd6b9e9554d6c0ec54ef44d60c6c0568"
}
```

4.根据区块hash获取交易

GET Request
```
curl --location 'https://explorer.horizen.global/api/txs/?block=0000000000656b507f462a515809aa693e50c15f0bf55624d21e0aefca7cb2c6' \
--data ''
```
Response
```
{
    "pagesTotal": 1,
    "txs": [
        {
            "txid": "fceee616106988c5175968b6c056625fe0d0fac9c6211c5f1f166d30058c553b",
            "version": 1,
            "locktime": 0,
            "vin": [
                {
                    "coinbase": "03ab441a082f5669614254432f",
                    "sequence": 4294967295,
                    "n": 0
                }
            ],
            "vout": [
                {
                    "value": "1.87508040",
                    "n": 0,
                    "scriptPubKey": {
                        "hex": "76a914ec4cc2b683c31ac2537a294fb1c56f85471f7a7e88ac",
                        "asm": "OP_DUP OP_HASH160 ec4cc2b683c31ac2537a294fb1c56f85471f7a7e OP_EQUALVERIFY OP_CHECKSIG",
                        "addresses": [
                            "znndMR7koR6treFnhAfzqX6AHheanpQWerz"
                        ],
                        "type": "pubkeyhash"
                    },
                    "spentTxId": null,
                    "spentIndex": null,
                    "spentHeight": null
                },

                ...
            
            ],
            "blockhash": "0000000000656b507f462a515809aa693e50c15f0bf55624d21e0aefca7cb2c6",
            "blockheight": 1721515,
            "confirmations": 17,
            "time": 1740304136,
            "blocktime": 1740304136,
            "isCoinBase": true,
            "valueOut": 3.1250804,
            "size": 194
        },
        
        tx2: ...

    ]
}
```
##### hd钱包用
1.获取地址交易(分页)

POST Request
```
curl --location 'https://explorer.horizen.global/api/addrs/txs' \
--header 'Content-Type: application/json' \
--data '{
    "addrs": "znndMR7koR6treFnhAfzqX6AHheanpQWerz",
    "from": 0,
    "to": 1,
    "noAsm ": 1,
    "noScriptSig": 1,
    "noSpent": 1
}'
```
Response
```
{
    "totalItems": 459537, //总交易数
    "from": 0,
    "to": 1,
    "items": [
        {
            "txid": "6c9896c5f5959ed9a73c0a9d9be241921cc7e3e4f1d3d8fcae569570b27e9f32",
            "version": 1,
            "locktime": 0,
            "vin": [
                {
                    "coinbase": "03c8441a082f5669614254432f",
                    "sequence": 4294967295,
                    "n": 0
                }
            ],
            "vout": [
                {
                    "value": "1.87500000",
                    "n": 0,
                    "scriptPubKey": {
                        "hex": "76a914ec4cc2b683c31ac2537a294fb1c56f85471f7a7e88ac",
                        "asm": "OP_DUP OP_HASH160 ec4cc2b683c31ac2537a294fb1c56f85471f7a7e OP_EQUALVERIFY OP_CHECKSIG",
                        "addresses": [
                            "znndMR7koR6treFnhAfzqX6AHheanpQWerz"
                        ],
                        "type": "pubkeyhash"
                    },
                    "spentTxId": null,
                    "spentIndex": null,
                    "spentHeight": null
                }

                ...

            ],
            "blockhash": "00000000012842510d95651dfd672f0099f026cedd65942c1866a270bbc9f14f",
            "blockheight": 1721544,
            "confirmations": 1,
            "time": 1740307953,
            "blocktime": 1740307953,
            "isCoinBase": true,
            "valueOut": 3.125,
            "size": 194
        }
    ]
}
```

2.获取余额(utxo)

POST Request
```
curl --location 'https://explorer.horizen.global/api/addr/znndMR7koR6treFnhAfzqX6AHheanpQWerz/utxo'
```
Response
```
[
    {
        "address": "znndMR7koR6treFnhAfzqX6AHheanpQWerz",
        "txid": "a2f9c84a654ac1fdcef44c2f3eb5980ace6cdbab45c23a93e1f0e27c9dc4284e",
        "vout": 0,
        "scriptPubKey": "76a914ec4cc2b683c31ac2537a294fb1c56f85471f7a7e88ac",
        "amount": 1.875,
        "satoshis": 187500000,
        "height": 1721547,
        "confirmations": 1
    },

    ...

]
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
1.horizen[官方钱包实现](https://github.com/HorizenOfficial/arizen/blob/master/app/zwallet.html#L537) 
默认最低10,000 satoshi,每次点击增加10,000 satoshi


## 五. 签名节点搭建
pnpm build
### 钱包 RPC 节点的搭建方式
- 1. insight https://github.com/HorizenOfficial/compose-sample-explorer
- 2. rosetta格式接口 https://github.com/HorizenOfficial/rosetta-zen
- 3. supernode [搭建指南](https://horizenofficial.atlassian.net/wiki/spaces/ZEN/pages/136872090/Community+Hosting+and+Setup+List+for+Super+Nodes+and+Forger+Nodes)

## 六. 总结
## 附录：
- 官网: https://www.horizen.io/
- scan/浏览器: https://explorer.horizen.io/
- cmc: https://coinmarketcap.com/currencies/horizen/
- github: https://github.com/HorizenOfficial
- discord: https://discord.com/invite/z8eebsj7Sv
- telegram: https://t.me/horizencommunity
- dao: https://horizen.discourse.group/
- repo zen: https://github.com/HorizenOfficial/zen
- repo zencashjs: https://github.com/HorizenOfficial/zencashjs
- repo arizen: https://github.com/HorizenOfficial/arizen
- superNode搭建说明: https://horizenofficial.atlassian.net/wiki/spaces/ZEN/pages/136872141/Super+Nodes
- rpc文档: https://github.com/HorizenOfficial/insight-api-zen
