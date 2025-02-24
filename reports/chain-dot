# 1、简介

1.  **Polkadot概述**：Polkadot提出了一种可扩展和可拓展的区块链互操作性框架。它通过将共识机制与状态转换机制解耦，提供了更多的灵活性和可扩展性。
2.  **区块链面临的挑战**：白皮书讨论了当前区块链系统面临的常见问题，如可扩展性、隔离性、可开发性、治理和适用性。
    *   **可扩展性**：Polkadot通过平行链模式实现高吞吐量和可扩展性，多个平行链并行处理交易。
    *   **隔离性**：Polkadot的异构多链架构允许不同应用根据需求选择合适的共识机制和治理方式。
    *   **可开发性**：Polkadot提供易用的开发工具和接口，简化区块链应用的开发与部署。
    *   **治理**：Polkadot采用去中心化治理机制，允许代币持有者和验证者共同决策系统升级。
    *   **适用性**：Polkadot支持多种类型的区块链在同一网络中互通，适应不同应用需求。
3.  **架构**：Polkadot的架构基于一个中继链（relay chain）和多个平行链（parachains）。中继链是负责协调的主链，而平行链则是独立的链，能够并行运行并进行互相通信。
4.  **共识机制**：Polkadot使用现代的拜占庭容错（BFT）算法来确保中继链和平行链的共识和安全。验证者在这一机制中扮演重要角色，恶意行为的验证者会受到惩罚。
5.  **互操作性**：Polkadot的一个关键特性是它能够实现不同区块链网络（平行链）之间的信任性通信和交互。这使得资产和数据能够在不同链之间自由转移，无需中央中介。
6.  **Polkadot中的角色**：

    *   **验证者（Validators）**：验证平行链的区块并确保共识。
    *   **提名者（Nominators）**：通过质押代币支持验证者。
    *   **汇总者（Collators）**：为平行链生成区块。
    *   **渔夫（Fishermen）**：独立的监督者，负责监控并报告验证者的不当行为。
7.  白皮书
    *   [Polkadot-whitepaper.pdf](https://polkadot.com/papers/Polkadot-whitepaper.pdf)
    *   白皮书提纲见本文附件

# 2、接入相关特性

## 2.1 多链结构

&#x9;		Polkadot 是一个具有共享安全性和互作性的异构多链。

&#x9;		Polkadot的多链架构是其核心创新，旨在通过\*\*中继链（Relay Chain）**与**平行链（Parachain）\*\*的协同设计，实现安全、可扩展且异构的区块链互联生态。

*   中继链（Relay Chain）：

    *   Polkadot主网, DOT是主网的原生代币
    *   Polkadot 的核心是中继链，它负责整个网络的安全性和共识管理。中继链不直接处理应用层的交易，而是负责验证平行链的交易并确保网络的统一安全性。
*   平行链（Parachains）：

    *   平行链是与中继链相连的独立区块链，它们可以有自己的特定功能和代币。
    *   每个平行链可以有独立的共识机制和处理逻辑，但它们共享中继链提供的安全性。
    *   多个平行链并行运行，使得 Polkadot 可以处理更高的交易量。
*   跨链通信（XCMP）：

    *   Polkadot 提供了跨链消息传递协议（XCMP），使得不同平行链之间可以进行数据和资产的互通。
    *   通过 XCMP，不同的平行链能够共享信息和资源，从而实现真正的跨链交互。
*   **桥接外部链（Bridges）**

    *   通过专用桥接平行链（如ChainBridge）连接以太坊、比特币等外部网络。
    *   实现资产跨链转移（如DOT与ETH互换）。
*   **共享安全性（Shared Security）**
    *   所有平行链共享中继链的验证者组，无需独立维护共识节点。
    *   平行链的有效性证明由中继链验证者通过零知识证明验证
*   实际生态案例
    | **平行链**             | **类型** | **功能**        | **技术特点**     |
    | :------------------ | :----- | :------------ | :----------- |
    | **Acala**           | DeFi链  | 稳定币发行、跨链资产抵押  | 自定义资产模块      |
    | **Moonbeam**        | EVM兼容链 | 以太坊DApp无缝迁移   | 完全兼容Solidity |
    | **Polkadot Bridge** | 跨链桥    | 连接以太坊、比特币等外部链 | 轻客户端验证 + 多签  |
    | **Unique Network**  | NFT链   | NFT批量铸造与跨链交易  | 专用元数据协议      |
*   参见[https://wiki.polkadot.network/docs/learn-architecture#parachain-slots]()
*   参见白皮书第3节关于整体架构的描述

## 2.2 状态模型

&#x9;Polkadot的**中继链选择==扩展的账户模型==**（支持Free/Frozen余额），以兼容复杂质押治理逻辑；而允许\*\*==Parachain自由选择模型==\*\*（如UTXO或账户），则体现了其“异构多链”的设计哲学。

### **2.2.1 中继链：==账户模型==**

&#x9;		中继链是一个**状态链**（State-Based Chain），其核心功能包括管理账户的余额（Balances）和交易计数器（Transaction Counter）。这与以太坊的账户模型一致，通过地址（Account）直接追踪余额和状态。(白皮书第6.1节)

*   **多类型余额分类:**

    &#x9;	Polkadot的中继链账户不仅包含基础余额（Balance）和Nonce，还引入了**多类型余额分类**，以**支持其质押、治理和链上经济模型**。以下是典型字段：

    *   **Free:** 是可用于链上活动（如质押、参与治理等）但不一定可花费（或可转让）的余额
    *   **Frozen:** 是为质押、治理和归属而锁定的自由余额（也称为锁定余额）
    *   **On hold:** 用于身份、代理、OpenGov 原像和存款，并且不再免费（也称为预留余额）
    *   \*\*Spendable: \*\* 是可以花费的可用余额。
    *   \*\*Untouchable: \*\* 是自由余额中不能移动（即不可花费）但仍可用于链上活动的部分

    \*\*		五种余额并不是简单的并列加在一起的关系!!\*\*

    &#x9;	详见<https://wiki.polkadot.network/docs/learn-account-balances>
*   **其他特点**：

    *   **固定手续费**：中继链交易采用统一费用（Flat Fee），无需动态计算Gas（与以太坊不同）。
    *   **交易计数器防重放**：每个账户通过计数器（Nonce）确保交易顺序，防止重复交易攻击。

### **2.2.2** **Parachain：==模型自由化==**

*   **灵活性**：Parachain作为平行链，可以自主选择状态模型。例如：

    *   **UTXO模型**：类似比特币，适用于简单支付场景。
    *   **账户模型**：类似以太坊，支持智能合约和复杂状态逻辑。
    *   **混合模型或其他**：如隐私链（Zcash）的屏蔽交易机制。
*   **验证独立性**：\
    每个Parachain需定义自身的有效性规则（Validity Conditions），由中继链验证者通过零知识证明等技术确保其合规性（见白皮书第6.7节）。

## 2.3 共识机制

&#x9;	Polkadot的共识机制==结合了==**==权益证明（PoS）的选举机制==**==和==**==拜占庭容错（BFT）的快速确定性==**，主要分为两部分：

*   **区块生产（BABE）**：负责生成新区块，确保链的持续扩展。
*   **最终性确认（GRANDPA）**：负责快速确认区块的不可逆性，提升安全性。

### 2.3.1 \*\*验证者选举：\*\*提名权益证明 **Nominated Proof-of-Stake (NPoS)**

*   验证者通过质押代币（DOT）参与共识，提名人（Nominators）可质押代币支持验证者。
*   验证者通过选举机制选出，选举过程优化质押分配以实现去中心化（原文描述见第6.2.1节）。
*   参见<https://wiki.polkadot.network/docs/learn-phragmen>
*   参见白皮书第6.2节（Staking Contract）

### 2.3.2 **区块生产：BABE（Blind Assignment for Blockchain Extension）**

*   BABE基于\*\*随机分配的插槽（Slot）\*\*生成区块，类似Cardano的Ouroboros Praos。
*   验证者通过可验证随机函数（VRF）确定出块权，避免中心化（原文提及“随机分组”和“密码学安全的哈希”）。
*   参见白皮书第6.4节（Sealing Relay Blocks）

### **2.3.3 最终性确认：GRANDPA（GHOST-based Recursive ANcestor Deriving Prefix Agreement）**

*   GRANDPA是一种**异步BFT算法**，通过多轮投票快速确定最终区块（原文描述为“现代异步拜占庭容错算法”）。
*   支持“链式最终性”（Chain-based Finality），一次可确认多个区块（原文提及“检查点锁存”和“有限链长度”）。
*   参见白皮书第6.4节（改进区块密封）

## 2.4 智能合约、非原生代币、NFT

### 2.4.1 主链（Relay Chain）

&#x9;		Polkadot主链（中继链）的核心职责是保障**全局安全性**和**跨链协调**，其设计遵循**最小化原则**，因此**不直接支持智能合约、非原生代币或NFT**。

*   相关参考:

    *   “中继链不部署公共智能合约，仅提供基础账户管理与质押逻辑”（第6.1节第三段）
    *   “中继链的状态模型专注于质押代币（DOT）的管理”（第6.1节第二段）
    *   中继链被描述为“无应用功能的基床”，仅托管Parachain的区块头（第3节第一段）

### 2.4.2 平行链（Parachains）

&#x9;		平行链作为Polkadot生态的**业务逻辑层**，每个平行链都可以拥有自己的特性、治理规则以及能够执行的功能。平行链支持更灵活的功能，并且可以\*\*==根据需要定制，支持智能合约、非原生代币和 NFT==\*\*。

*   **Polkadot 的主链（Relay Chain）和平行链（Parachains）都基于 Substrate 构建**。而Substrate支持Uniques/NFTs/ORML/Wasm等模块用于实现**智能合约、非原生代币或NFT。**

*   相关参考:

    *   “平行链可选择集成智能合约模块，支持去中心化应用开发”（附录A“智能合约语言”部分）。
    *   “跨链交易路由允许任意数据传递，包括代币转移指令”（第5.4节第二段）。
    *   “平行链可托管任意动态数据结构，包括非同质化资产”（第3节第三段）。

## 2.5 质押

&#x9;		Polkadot的质押机制是其共识安全性与去中心化治理的核心，基于 **Nominated Proof-of-Stake (NPoS)** 设计，结合经济激励与惩罚机制，确保网络长期稳定。

&#x9;	参见[https://wiki.polkadot.network/docs/learn-staking-advanced]()

&#x9;	参见白皮书第6.2节(质押合约)

### 2.5.1 质押系统的角色:

*   **验证人（Validators）**：验证人负责验证平行链的区块，并将它们添加到主链（Relay Chain）。他们还需要确保网络的安全性和正确性。
*   **提名人（Nominators）**：提名人将他们的 DOT 质押给选定的验证人，以此支持验证人的工作。提名人通过选举信任的验证人来间接参与网络的共识。

### 2.5.2 质押的步骤

1.  **选择验证人**
2.  **验证人选举**
3.  **验证和出块**
4.  **奖励与惩罚**

### 2.5.3 最小质押金额

*   **动态调整:** Polkadot 的治理机制允许网络参数（包括验证人质押的最低金额）根据当前的验证人数量、质押总量、网络需求等因素进行动态调整
*   **影响因素**：

    *   **验证人数量**。验证人的数量过多，最小质押金额可能会上升。
    *   **质押总量**(总质押率)。当质押量较低时，可能会降低验证人的最小质押金额，以鼓励更多的验证人加入。
*   **调整的目的:**

    *   最小质押金额的动态性, 客观上形成了一种类似竞价机制的效果。
    *   想成为验证者应该最少要质押比最后一名多1DOT
    *   这种机制的目的是为了**控制验证者数量**, 把验证者数量控制在**1000**个
    *   如果网络中验证人**过多**，可能会导致验证工作分散，**降低**区块链的**吞吐量和性能**；
    *   而如果验证人**过少**，则可能**影响**到**验证的多样性**和**网络的容错能力**。
*

### 2.5.4 质押奖励和通货膨胀(inflation)

*   奖励

    *   每个era结束时获得质押奖励
    *
*   **通货膨胀(inflation)**

    *   每年 120,000,000 DOT。
    *   85% 奖励给履行职责的验证者
    *   15% 进入国库

### 2.5.5 惩罚机制

*   **触发条件**：

    *   验证者离线（Inactivity）。
    *   参与分叉（Equivocation）或验证无效区块。
*   **惩罚力度**：

    *   轻微违规（如短暂离线）：扣除部分质押。
    *   严重攻击（如双重签名）：没收全部质押。

### **2.5.6 质押代币流动性**

*   **锁定周期**：

    *   解质押需等待**解绑期**（Unbonding Period，**约28天**）。
    *   解绑期间代币不可转让或获得奖励。

*   **流动性管理**：

    *   **提名人**可**随时更换**支持的**验证者**，**无需解绑**代币。

*

## 2.6 代币精度

### 2.6.1 精度

*   DOT 代币具有 **10^10**（即 10 亿）个最小单位（称为 "Planck"）。也就是说，1 DOT 可以分割成 10 亿个最小单位（Planck）。

### 2.6.2 “面额日”（"Nominal Day"）

*   **日期**：2020 年 8 月 21 日，区块编号为 **1,248,328**。
*   在 8 月 21 日之前，DOT 的计价为 1e12 Planck，即小数点后 12 位。
*   在面额日之后，DOT 的计价为 1e10 Planck，即小数点后十位。
*   这只是对DOT的重新定义, Nominal Day前后你拥有的Planck数量不变,但是DOT拥有量增加了100倍

## 2.7 出块速度 &#x20;

*   Kusama(测试网) 和 Polkadot 网络目前都以**每 6 秒一个区块**的速度运行。
*   这将来可能会改变。优化后，它**可能会低至 2 到 3 秒**，或者**可能会增加**，以便在实时环境中处理平行链网络的容量。

## 2.8 每秒交易数 （TPS）

*   基于 Substrate 的区块链可以实现超过 1000 TPS 的余额转移交易。
*   Polkadot 的每秒交易数 （TPS） 是一个包含中继链和平行链上所有交易的数字。
    *   &#x20;Polkadot 的TPS　＝　ＳＵＭ（各个平行链ＴＰＳ）
    *   假设有100条平行链，预计的 TPS 超过 100,000
*   未来，通过**异步备份升级**，TPS 预计将增加 **10 倍**。

## 2.8 标签　Tag/Memo

*   主链．**原生交易模型未包含Tag/Memo字段**，其设计专注于最小化功能以保障高效共识与跨链通信。
*   平行链．可**自定义交易格式**，包括添加Tag/Memo字段，具体实现取决于其业务需求
*   参见Polkadot浏览器交易数据
*   参见白皮书第6.7节

## 2.9　RPC URL(open node)

&#x9;	[https://hk.p.bifrost-rpc.liebi.com]()　(出自https\://chainlist.org/chain/996)

&#x9;	<https://dot.getblock.io/mainnet/>	（getblock）

&#x9;	<https://rpc.polkadot.io>　　

## 2.10 钱包 RPC 节点的搭建

```bash
docker run -p 9944:9944 -p 9615:9615 parity/polkadot:v1.16.2 --name "my-polkadot-node-calling-home" --rpc-external --prometheus-external
```

*   详细说明
    *   <https://docs.polkadot.com/infrastructure/running-a-node/setup-full-node/>
    *   <https://paritytech.github.io/devops-guide/guides/rpc_index.html>
*

## **2.11 签名算法**

*   参见[https://wiki.polkadot.network/docs/learn-cryptography#keypairs-and-signing]()
*   参见白皮书附录A的“加密子系统”部分，以及第4.4节的多签需求与高效性要求

### 2.11.1 **主链（中继链）**

&#x9;Polkadot主链主要支持两种签名算法：

*   **(1) Ed25519**

    *   **基础**：基于椭圆曲线Edwards25519，属于EdDSA（Edwards-curve Digital Signature Algorithm）家族。
    *   **用途**：

        *   主链验证者签名区块头。
        *   ==用户普通交易签名==（默认选项）。
    *   **特点**：

        *   **高效**：签名速度快，验证时间短，适合高频交易场景。
        *   **安全性**：抗量子计算攻击（目前尚未被破解）。
        *   **标准化**：广泛用于区块链项目（如Solana、Near Protocol）。

<!---->

*   **(2) SR25519（Schnorrkel）**

    *   **基础**：基于Schnorr签名的变体，由Polkadot团队开发。
    *   **用途**：

        *   ==治理提案的多签授权==。
        *   高级交易场景（如隐私增强交易）。
    *   **特点**：

        *   **签名聚合**：多个签名可合并为单个签名，节省链上空间。
        *   **多重签名支持**：天然支持多签逻辑，无需复杂脚本。
        *   **密钥衍生**：支持分层确定性钱包（HD Wallet）。

### 2.11.2 **平行链（Parachain）**

*   平行链可**自定义签名算法**，
*   参见白皮书第6.7节（Parachain Validation）
*   常见选择包括：

    *   **(1) 继承主链算法（Ed25519/SR25519）**

        *   **场景**：与主链高度交互的平行链（如跨链资产转移）。
        *   **优势**：无需额外适配层，签名验证直接兼容中继链。
    *   **(2) ECDSA（以太坊兼容）**

        *   **场景**：需要与以太坊生态互操作的平行链（如Moonbeam）。
        *   **实现方式**：

            *   平行链节点支持ECDSA签名验证。
            *   用户地址通过以太坊格式（如0x开头）生成。
    *   **(3) 其他算法（如BLS、Secp256k1）**

        *   **场景**：

            *   **BLS签名**：用于隐私链或需要高效聚合签名的场景。
            *   **Secp256k1**：兼容比特币生态。
        *   **限制**：需平行链自行实现签名验证逻辑，并确保中继链验证者能处理。

# 3、SDK

<https://github.com/polkadot-js/common>

<https://github.com/paritytech/txwrapper-core/>



## 3.1 离线地址生成

```typescript
/**
 * 生成 Polkadot 地址
 * @param seed - 种子
 * @param addressIndex - 账户索引 (BIP44 路径的最后一层索引)
 * @param useSr25519 - 是否使用 Sr25519 算法生成密钥对
 * @returns 返回对象 { privateKey, publicKey, address }
 */
async function generatePolkadotAddressBySeed(seed: any, addressIndex: number , useSr25519: boolean = false) {
    //await import('@polkadot/util-crypto/initWasm').then((wasm) => wasm.default()); // 初始化加密库
    if (useSr25519){
        await cryptoWaitReady();
    }
    // 2. 使用 BIP44 路径计算密钥
    const path = `m/44'/354'/0'/0'/${addressIndex}'`; // Polkadot BIP44 路径
    const { key } = derivePath(path, seed);

    // 2. 生成密钥对（支持 Sr25519 和 Ed25519）
    const keyPair = useSr25519 ? sr25519PairFromSeed(key) : ed25519PairFromSeed(key);
    // 3. 获取公钥（Hex 格式）
    const publicKeyHex = u8aToHex(keyPair.publicKey);

    // 4. 生成 Polkadot 地址（SS58 编码）
    const address = encodeAddress(keyPair.publicKey, 0); // 0 代表 Polkadot 主网

    return {
        privateKey: u8aToHex(keyPair.secretKey), // 私钥 Hex
        publicKey: publicKeyHex, // 公钥 Hex
        address: address // Polkadot 地址
    };
}
```

## 3.2 导入秘钥

<https://github.com/paritytech/txwrapper-core/blob/main/packages/txwrapper-core/src/core/util/importPrivateKey.spec.ts>

```typescript
import { importPrivateKey,KeyringPair } from '@substrate/txwrapper-polkadot';

function getKeyringPair( privateKey: string | Uint8Array, ss58Format: number ): KeyringPair  {
    const keypair = importPrivateKey(privateKey,ss58Format);
    return keypair;
}
```

## 离线签名

<https://wiki.polkadot.network/docs/build-transaction-construction#tx-wrapper>

<https://github.com/paritytech/txwrapper-core/tree/main/packages/txwrapper-core/src/core/construct>









# 4、RPC接口

<https://polkadot.js.org/docs/polkadot/rpc>

<https://docs.getblock.io/api-reference/polkadot-dot>

<https://github.com/polkadot-js/api/tree/master/packages/rpc-provider>

<https://github.com/paritytech/substrate-api-sidecar>

## 4.1 获取最新区块

```bash
curl --location 'https://rpc.polkadot.io' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "chain_getBlock",
  "params": null,
  "id": 1
}'
```

**response:**

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "block": {
            "header": {
                "parentHash": "0x31e2d5d1023d9965dac3afc13fc284cffdf6f460d2711054866dbe53488806b1",
                "number": "0x17b6e1c",
                "stateRoot": "0x1647e68b4154613236416fcbc176d5753c120c0eb8e28f4948bd3ac95799e0ce",
                "extrinsicsRoot": "0x4fae7634f26f912e31d31dfb156d3eb1f00721d5371d32d3e6cc343252e7511e",
                "digest": {
                    "logs": [
                        "0x0642414245b50103f101000046f94911000000005e2a3ebfcb2231d87c7b8fa1d3e677c6917b6e16e5b7d67730b4b97a91efc76e559901f5636b524bfa2470e76dc5477c2ffdff19327b17c969db3b1046709501749e1aa96b28b9aa051951d826a8bf8ec477d5667fdde17ccf706468c8a87f04",
                        "0x0442454546840316bd37214da507747b7ced3936ee61e630467c80a75dff58e0d61e76125e517e",
                        "0x054241424501013ee9f67bd67dea4bc19ea345d85e37cf25d0a37a67ac4409fc1478e67f7fd57b0c11ab03ee0eca2d7703c2edd180e34f4421e1a365928198113383ebbd210c8c"
                    ]
                }
            },
            "extrinsics": [
                "0x280403000ba058c2359501",
                "0x9e8e0300043600c5079101dff7c94c972d1．．．",
                "0x510284004f3396dd2c6b55498f67ce8883524360347427e30cbc50fb981922de73c4551e00c1e6bc2bf8229250b4253810c3ffd942162499162e9f2b9cb2c9529bd13548399db00a5a3fb41fe36c707450f971a1f7341a7267bdebf06b4e5fece0287f49048921aec609000000050300880a5fb3418f1e8922ff8ec1c654ac92f58df1f3963dd79b77bc7ed8f6852733073caab63f0a"
            ]
        },
        "justifications": null
    }
}
```

## 4.2 获取区块详情

```typescript
curl -L 'https://rpc.polkadot.io' \
-H 'Content-Type: application/json' \
-D '{
  "jsonrpc": "2.0",
  "method": "chain_getBlock",
  "params": ["0x2d361a0294b14428c59afe00906b0b2fbcb8a190a16ac44f36c1c0e6bb7f0ad5"],
  "id": 1
}'
```

response:

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "block": {
            "header": {
                "parentHash": "0xe2a45b86c7663658f0d6a92ee09802e218c4736bbdefb92b2483d6643b4edb4a",
                "number": "0x17b6da3",
                "stateRoot": "0x36f6e0e951091b772be821ffa7c4dac1c43b9bb1e93253cd1e549bf9fef82367",
                "extrinsicsRoot": "0x8b34c2f957f346dd4d10dfbd351278a9c7431216f9f5f8c4d7319bb88db0f206",
                "digest": {
                    "logs": [
                        "0x0642414245b501033b010000ccf8491100000000be1c4f12efd670e31adcab8a7f4c930e2c942300f1b412b5282442b1a56e634d516f99b3d43a20cf5228dc026319f7e2dc618c4e11c9ef65ed54af8b37758a07ab1d9b192bffc41e37cf2db0f42fe600492535a4d0d331261a0bd99651ada301",
                        "0x044245454684031cf48fb3648682733c68c58601a85619a3de44e627238970c921a67628d3db5a",
                        "0x0542414245010174a50cfbcf7ab9ef1d77a26fc1085c20101d6f78adfe5ce206568ff00596bd37a2ccf69b6150c9609ae2ebad85dbf5604df1e08b74e3efb47e06bbce687dd085"
                    ]
                }
            },
            "extrinsics": [
                "0x280403000b402db7359501",
                "0x7ad70300043600c507910100fbbb0fd44d60000．．．．．．",
                "0xad018400de9f3d657734305f654dca7e47b01798a9c6337e8ff89adf15cbc94e775f76a800c25a87050cda9ab0b89265019f36cb5e47944964b1335cfd40c09414ef810f89a2e9a9117d273ca79df461600c76c44a5abd88a46c1b808f4eaf432457b331038501e80001270101"
            ]
        },
        "justifications": null
    }
}
```

解析区块

```typescript

import {ApiPromise, HttpProvider} from "@polkadot/api";

async function testRpc() {

    const HTTP_URL = 'https://rpc.polkadot.io'; // 'https://docs-demo.dot-mainnet.quiknode.pro';

    let http: HttpProvider = new HttpProvider(HTTP_URL);
    // http.send('chain_getBlockHash', {
    //     id: 1,
    //     jsonrpc: '2.0',
    //     method: 'test_body',
    //     params: ['param']
    //
    // });
    const api = await ApiPromise.create({ provider:http });

// 获取区块信息
    const block = await api.rpc.chain.getBlock("0x2d361a0294b14428c59afe00906b0b2fbcb8a190a16ac44f36c1c0e6bb7f0ad5");
    console.log(block.block.hash.toJSON());
    block.block.extrinsics.forEach((extrinsic, index) => {
        console.log(extrinsic.method.toString());
        // TODO
        // if (extrinsic.method.methodName === 'transfer') {
        // const [to, amount] = args;
        // console.log('  转账地址:', to.toString());
        // console.log('  转账金额:', amount.toString());
        //
        // }
    })

}
(async () => {
    await testRpc();
})();
```

## 4.4发送交易

```bash
curl --location 'https://rpc.polkadot.io' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "author_submitExtrinsic",
  "params": ["txHash"],
  "id": 1
}'
```

**response:**

```json
```



## 4.5 获取交易所需信息

```typescript
// 获取链信息　　创世块／链名称
export async function getChainInfo(api : ApiPromise) {
    return {
        genesisHash: await getGenesisHash(api),
        chainName: await getChainName(api)

    }
}
// 获取区块头　　　　块哈希／块号
export async function getBlockHeader(api : ApiPromise) {
    const block = await api.rpc.chain.getBlock();
    return {
        blockHash: block.block.hash.toHex(),
        blockNumber: block.block.header.number.toNumber(),
    }
}
// 获取运行时版本／交易版本／区块链规范名称
export async function getRuntimeVersion(api : ApiPromise) {
    const runtimeVersion = await api.rpc.state.getRuntimeVersion();
    return {
        specVersion: runtimeVersion.specVersion.toNumber(),
        transactionVersion: runtimeVersion.transactionVersion.toNumber(),
        specName: runtimeVersion.specName.toString(),
    }
}
// 获取链名称
export async function getChainName(api : ApiPromise) {
    return (await api.rpc.system.chain()).toString()
}
// 获取获取创世块哈希
export async function getGenesisHash(api : ApiPromise) {
    return (await api.rpc.chain.getBlockHash(0)).toHex()
}
// 获取获取ＮＯＮＣＥ
export async function getNonce(account: string, api : ApiPromise ) {
    return (await api.rpc.system.accountNextIndex(account)).toNumber()
}
```

## 4.5.2 获取最新区块

# 附件１．Polkadot白皮书提纲

***

#### **摘要**

*   现有区块链架构在可扩展性和扩展性方面存在缺陷，主要源于“规范性”与“有效性”的紧密耦合。
*   提出**异构多链框架**，分离规范性（共识）与有效性（状态转换），通过分治策略实现扩展性。
*   支持多种共识系统在去中心化“联邦”中互操作，兼容现有网络（如以太坊）。

***

#### **1. 前言**

*   本文为技术愿景总结，非最终规范，核心协议将作为概念验证的起点。
*   修订历史：2016年9月至11月多个版本迭代。

***

#### **2. 引言**

*   **区块链的五大挑战**：
    1.  **可扩展性**：全球资源消耗与交易吞吐量。
    2.  **隔离性**：多应用需求的最优满足。
    3.  **开发友好性**：工具链与集成支持。
    4.  **治理**：去中心化系统的灵活演进。
    5.  **适用性**：技术是否解决核心需求。
*   **现有方案局限性**：
    *   PoW（比特币）与PoS（NXT）均耦合共识与状态转换。
    *   其他方案（如Factom、Cosmos、Casper）的对比分析。

***

#### **3. 总结**

*   Polkadot是**可扩展的异构多链**，核心为中继链（Relay-Chain），托管并行化链（Parachain）。
*   关键特性：
    *   **共享安全性**：所有链共享中继链的安全保障。
    *   **无信任跨链交易**：通过中继链实现链间通信。
*   哲学原则：最小化、简单性、通用性、鲁棒性。

***

#### **4. Polkadot的参与角色**

1.  **验证者（Validators）**
    *   负责区块最终确认，需质押代币，恶意行为将受惩罚。
2.  **提名人（Nominators）**
    *   通过质押支持验证者，分享收益与风险。
3.  **收集者（Collators）**
    *   为特定Parachain打包交易并生成零知识证明。
4.  **渔夫（Fishermen）**
    *   监控网络，举报恶意行为以获取奖励。

***

#### **5. 设计概览**

*   **共识机制**：基于BFT算法（如Tendermint），结合PoS选举验证者。
*   **质押证明（NPoS）**：验证者通过提名权益选举，质押代币需长期锁定。
*   **Parachain与收集者**：Parachain通过中继链实现最终性，收集者负责交易打包。
*   **跨链通信**：基于中继链的队列机制，支持异步跨链交易路由。
*   **与以太坊/比特币的互操作性**：通过“桥接合约”实现跨链资产转移。

***

#### **6. 协议深度解析**

1.  **中继链运行机制**
    *   类似以太坊的状态链，但无智能合约部署功能，仅支持固定操作。
2.  **质押合约**
    *   管理验证者集、提名机制及惩罚规则。
3.  **Parachain注册表**
    *   动态管理链的元数据与路由队列。
4.  **区块密封（Sealing）**
    *   多阶段投票验证Parachain区块的有效性与数据可用性。
5.  **跨链路由优化**
    *   超立方路由（Hypercube）降低复杂度，解决数据可用性问题。

***

#### **7. 协议实用性**

*   **跨链交易支付**：依赖链间协商机制（如Serenity的Gas模型）。
*   **新增链的经济模型**：社区通过质押代币投票决定是否接纳新链。

***

#### **8. 结论与开放问题**

*   Polkadot为异构多链提供灵活框架，但仍需解决网络分叉恢复、奖励分配优化等问题。

***

#### **附录**

*   **功能组件清单**：网络子系统、共识机制、质押链、Parachain实现等。
*   **常见问题（FAQ）**：
    *   Polkadot非替代现有链，代币用于质押而非货币，通胀率动态调节。

***

#### **参考文献**

*   引用关键论文与技术文档（如Tendermint、Cosmos、以太坊黄皮书等）。

***

**注**：此提纲基于白皮书核心内容结构化整理，保留技术术语准确性，并优化逻辑层次。完整翻译需逐节处理，建议分阶段交付。
