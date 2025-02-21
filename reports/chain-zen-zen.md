## zen-chain 接入调研
zen正处在[Horizen 2.0 migration](https://www.horizen.io/horizen-upgrade) 升级中.目前,horizen[官网](https://www.horizen.io/)不提供pow链(zen)的文档,接口文档等,此调研来源于github上HorizenOfficial的代码库
## 一.链的特性
### 账户模型还是 UTXO
UTXO->[zen代码库](https://vscode.dev/github/HorizenOfficial/zen/blob/main/src/main.h#L465) 
### 签名算法
[secp256k1 ecdsa](https://vscode.dev/github/HorizenOfficial/zen/blob/main/src/secp256k1/include/secp256k1.h#L68)
### 代币精度
8->[zen代码库](https://github.com/HorizenOfficial/zen/blob/main/src/amount.h#L18)
### 共识机制
[pow](https://vscode.dev/github/HorizenOfficial/zen/blob/main/src/pow.h#L6)
#### 确认位
建议提币确认位:80 block
1block = 2.5min
80 = 200min

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

### 离线地址生成方式
## 三.离线签名
## 四.扫链的 RPC 接口解析
super node list:
- https://supernodes1.eu.zensystem.io/
- https://supernodes2.eu.zensystem.io/
- https://supernodes1.na.zensystem.io/
- https://supernodes2.na.zensystem.io/

### 扫链的 RPC 接口
#### cex用
#### hd用
### 扫链回来的交易的解析
### 扫链回来的交易手续费的计算
## 五. 签名节点搭建
### 钱包 RPC 节点的搭建方式
supernode [搭建指南](https://horizenofficial.atlassian.net/wiki/spaces/ZEN/pages/136872090/Community+Hosting+and+Setup+List+for+Super+Nodes+and+Forger+Nodes)

## 六. 总结
## 附录：
- 1.zen: https://github.com/HorizenOfficial/zen
- 2.zencashjs: https://github.com/HorizenOfficial/zencashjs
- 3.superNode搭建说明: https://horizenofficial.atlassian.net/wiki/spaces/ZEN/pages/136872141/Super+Nodes
