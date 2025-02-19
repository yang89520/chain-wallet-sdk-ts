# Oasis 调研报告

## 相关链接

### 官网和文档

https://docs.oasis.io/  
https://oasisprotocol.org/

### coinmarketcap 地址

https://coinmarketcap.com/currencies/oasis-network/

### github

https://github.com/oasisprotocol/

### 浏览器

https://explorer.oasis.io/  
https://www.oasisscan.com/

### RPC URL(open node)
接口文档  
https://nexus.oasis.io/v1/spec/v1.html  
https://docs.oasis.io/core/oasis-node/rpc/  
https://docs.cdp.coinbase.com/mesh/docs/welcome

### 钱包 RPC 节点的搭建方式
搭建方式文档  
https://docs.oasis.io/node/run-your-node/

### 账户模型还是 UTXO  
账户模型浏览器看转账  

### 签名算法
- Ed25519 address derivation compatible with the consensus layer.  
- ethereum-compatible address derivation from Secp256k1 public keys.

### 代币精度
```
"mainnet": {
			ChainContext: "bb3d748def55bdfb797a2ac53ee6ee141e54cd2ab2dc2375f4a0703a178e6e55",
			RPC:          "grpc.oasis.io:443",
			Denomination: DenominationInfo{
				Symbol:   "ROSE",
				Decimals: 9,
			},
			ParaTimes: ParaTimes{
				Default: "sapphire",
				All: map[string]*ParaTime{
					// Cipher on Mainnet.
					"cipher": {
						ID: "000000000000000000000000000000000000000000000000e199119c992377cb",
						Denominations: map[string]*DenominationInfo{
							NativeDenominationKey: {
								Symbol:   "ROSE",
								Decimals: 9,
							},
						},
						ConsensusDenomination: NativeDenominationKey,
					},

					// Emerald on Mainnet.
					"emerald": {
						ID: "000000000000000000000000000000000000000000000000e2eaa99fc008f87f",
						Denominations: map[string]*DenominationInfo{
							NativeDenominationKey: {
								Symbol:   "ROSE",
								Decimals: 18,
							},
						},
						ConsensusDenomination: NativeDenominationKey,
					},

					// Sapphire on Mainnet.
					"sapphire": {
						ID: "000000000000000000000000000000000000000000000000f80306c9858e7279",
						Denominations: map[string]*DenominationInfo{
							NativeDenominationKey: {
								Symbol:   "ROSE",
								Decimals: 18,
							},
						},
						ConsensusDenomination: NativeDenominationKey,
					},
				},
			},
		},
```
### 共识机制
POS

### 确认位
参考binance 1个块 

### 是否支持质押，POS 链是支持质押
支持质押

### 是否支持代币和 NFT(合约)
ParaTimes链 兼容EVM

### 质押的方式
大于等于100ROSE可质押

### 是否支持 Tag/Memo
不支持

### 是否为多链结构
是  
https://docs.oasis.io/general/oasis-network/


### 扫链的 RPC 接口
https://nexus.oasis.io/v1/spec/v1.html  
https://docs.oasis.io/core/oasis-node/rpc/  
https://docs.cdp.coinbase.com/mesh/docs/welcome




#  Oasis 核心特点
Oasis 是首个专为可扩展性和机密计算设计的 Layer 1 区块链。Oasis 是 Sapphire 的诞生地，Sapphire 是首个机密 EVM（以太坊虚拟机），赋能 Web3 和去中心化 AI 开发者，使其能够在 Oasis 或其他基于 EVM 的链上原生构建具有“智能隐私”功能的去中心化应用（dApps）。

ROSE 是 Oasis 网络的原生代币，用于支付 Gas 费用、质押、委托和治理。凭借独特的分层架构，Oasis 为 DeFi、AI、GameFi、NFT、元宇宙、数据代币化和 DAO 治理提供了最佳的构建和执行环境。Oasis 还在共识层原生支持 Rollups。  

**智能隐私**  
更好的 dApps 需要更智能的隐私。因此，Oasis 致力于为 Web3 和 AI 提供“智能隐私”，通过灵活、完全可定制的机密性框架，取代当前僵化、复杂且低效的工具。借助 Sapphire 运行时及其配套的 Oasis 隐私层（OPL，适用于基于 EVM 的链），Oasis 为任何 Web3 开发者带来了尖端的机密性技术，即使他们并不直接在 Oasis 网络上构建应用。对于运行在独立主链上的应用，OPL 允许将 Sapphire 的强大隐私功能集成到 Web3 的任何层级。通过创建具有无限可定制性的机密性频谱，Oasis 正在重新定义开发者对隐私集成的思考方式，并重塑 Web3 和 AI 中优先考虑隐私的工具集。

**分层架构**  
设计 Oasis 网络时，一个关键决策是将网络的共识层与计算层分离。Oasis 通过计算层上的运行时环境提供隐私保护计算。共识层由权益证明（PoS）机制保护，负责就交易排序、有效性和全局状态达成全网共识。计算层作为智能合约的执行平台，由多个并行运行时（ParaTimes）组成，这些运行时专为特定的计算需求而构建。

这种分层方法使得在 Oasis 上运行或使用 Oasis 技术但在其他主网络上运行的任何 dApp 都能实现动态且低成本的部署。每个 ParaTime 都接入 Oasis 共识层。每个 Oasis 运行时也可以独立发展，同时保持共识层提供的安全性，使用户和开发者能够完全控制其 dApp 及相关数据的执行和机密性。

**高效的机密性**  
Oasis 通过同时优化效率和机密性，与其他隐私网络和技术区分开来。每个 dApp 管理不同数量和类型的用户数据，但所有数据负载都可以在 Oasis 上以相同的效率处理。从数据密集型的智能合约到简单的交易数据，两者都可以在 Oasis 运行时中高效执行，并可选地使用端到端加密。

通过分离共识层和计算层，Oasis 允许其执行环境互不干扰。共识在单独的层上完成，计算层上的应用在需要时访问共识层。虽然其他网络要么通过低效计算提供极端隐私，要么在缺乏强大隐私的情况下提供极端效率，但 Oasis 的架构同时实现了两者。

# 技术亮点

Oasis 的计算层支持多个并行运行时（ParaTime）环境，这使得 Web3 开发者可以在任何现有运行时上构建去中心化应用，甚至启动自己的运行时。独特的 ParaTime 可以独立开发，以满足任何应用的特定需求，包括隐私参数、质押要求、开发语言等。

目前，Oasis 上已经运行了三个独立的 ParaTime：Sapphire、Emerald 和 Cipher。

**Sapphire** 是首个兼容 EVM 的机密运行时。Sapphire 为开发者提供了独特的能力，可以构建基于 EVM 的链上 dApp，其智能合约可以是完全机密的、完全公开的，或在机密性频谱上的任何位置。Sapphire 是一个开创性的开发者环境，为任何 EVM 开发者提供了熟悉的构建环境，同时结合了 Oasis 智能隐私技术的优势。

**Emerald** 是建立在 Oasis 上的一个运行时，提供完全的 EVM 兼容性和高性能可扩展性。Emerald 旨在解决每个 Web3 开发者面临的两个关键问题：Gas 费用和跨链互操作性。使用 Emerald 运行时，开发者可以确信他们的用户不会遇到性能延迟或意外的网络拥堵。

**Cipher** 是一个基于 WebAssembly（WASM）的隐私支持运行时，构建在 Oasis 上。借助 Cipher 和 Oasis 合约 SDK，开发者可以使用 Rust 构建下一代机密 dApp。

但 Sapphire 的强大功能并不仅限于原生 Oasis 开发者。通过 Oasis 隐私层（OPL）框架，Oasis 将 Sapphire 的隐私能力带给了整个 Web3。加密开发者可以无缝地将 Oasis 隐私功能添加到他们在任何 EVM 网络上的现有 dApp 中，而无需将应用和用户迁移出他们的原生区块链。

对于 Oasis 网络的原生构建者和用户，有一系列工具支持在网络上进行无缝的监控和交易体验。

**Oasis Wallet** 是官方的非托管钱包，用于在 Oasis 网络上存储、发送和接收数字资产。通过 ProtoFire 在 Sapphire 上成功部署的 Oasis Safe 以及与 Transak 的合作，Oasis 用户还可以访问行业领先的托管选项和便捷的 Oasis 生态入口。

**Oasis Explorer** 提供了一个易于使用的工具，深入挖掘 Oasis 用户和开发者的链上活动。通过展示所有 Oasis 运行时环境中的强大数据和分析，Explorer 为用户查询数据，以分析 Oasis 的增长和发展。

**Oasis Nexus** 是 Oasis 网络的官方索引工具，也是浏览器和钱包的后端。Nexus 持续从一个或多个 Oasis 节点获取区块链数据，解析数据并将其存储到一个高度索引的 SQL 数据库中，该数据库提供基于 JSON 的 Web API 以访问数据。


