# icp-wallet-sdk

icp wallet sdk

- 相关链接
  - 官方文档
    - https://internetcomputer.org/docs/current/home
  - CMC地址
    - https://coinmarketcap.com/currencies/internet-computer/
  - Github
    - https://github.com/dfinity/ic
  - 浏览器
    - https://dashboard.internetcomputer.org/
    - https://www.icpexplorer.org/
- RPC URL(open node)
    - 没有传统的公开 RPC 节点，官方没有提供一个默认的、全网共享的“公开 RPC 节点”来直接连接网络。
    - 边界节点是公开可访问的，任何人都可以通过 HTTPS 接口（如 https://ic0.app 或 https://icp-api.io）与 ICP 主网交互。这些节点由
      DFINITY 和社区节点提供商共同维护。这里 icp-api.io 是一个公开的边界节点端点。
    - ICP 支持 Rosetta API（一种区块链标准接口），可以通过 Docker 部署 Rosetta 节点连接到 ICP 主网。这不是传统 RPC，但提供了类似功能。
- 钱包 RPC 节点的搭建方式
    - https://wiki.internetcomputer.org/wiki/Node_Provider_Onboarding
    - 成为 ICP 上的节点提供商需要 DAO 社区的投票。这样做有两个原因：
    - 它确保硬件满足 ICP 的高标准：64 个 CPU 核心、512GiB RAM、30TB NVMe SSD。这样的节点可以维持高吞吐量并支持强大的 Web3
      应用程序。
    - 它确保社区知道节点提供商的身份。节点提供商已签署善意声明，如果节点行为不当，可能要承担责任。这使得 Sybil 攻击更难实施，并允许在保持
      Nakamoto 系数较高的同时减少节点数量。节点被分配到子网，以最大限度地实现运营商、地理位置和管辖权方面的去中心化。这称为确定性去中心化。
    - 目前，子网包含 13 到 40 个节点，大多数节点分布在不同地区。但是，也可以有本地化子网，以支持需要遵守当地法规的应用程序。
- 账户模型还是 UTXO
    - 账户模型
    - ICP 使用的是一个基于账户的系统，其中每个用户或实体都有一个关联的账户（或称为“Principal”），账户余额以 ICP
      代币的形式记录。交易会直接更新这些账户的状态，而不是像 UTXO
      那样依赖未花费的输出集合。这种设计与以太坊的账户模型更为相似，即状态是通过账户余额直接管理的，而不是通过追踪一系列未花费的交易输出。
- 签名算法
    - secp256k1: 用于用户交易签名（如 ICP 代币转账）和身份验证（Principal）。 与比特币和以太坊兼容，密钥长度为 256 位，提供 128
      位安全性。
    - BLS: 用于共识机制中的阈值签名（Threshold Signatures），生成随机信标和验证子网状态。
      基于配对密码学（如 BLS12-381），支持签名聚合。
    - 在默认情况下，Ed25519 并不是 ICP 的核心签名算法，但它可以通过特定的方式在网络上实现支持。
- 代币精度
    - 8
- 共识机制
    - ICP采用了叫做Threshold Relay和Internet Computer Consensus混合型共识机制
    - 确认位
        - 区块确认时间：1-2 秒，最终确认只需 1 个区块。
    - 是否支持质押，POS 链是支持质押
        - 支持质押，但它的质押机制与传统的权益证明（Proof of Stake, PoS）区块链（如以太坊 2.0 或 Cardano）有所不同。
- 是否支持代币和 NFT(合约)
    - 支持代币
        - ICRC-1：用于创建同质化代币，类似于以太坊的 ERC-20，提供基本的转账、余额查询等功能。
        - ICRC-2：ICRC-1 的扩展，支持代币的审批和代理转账功能。
    - 支付NFT
        - ICRC-7：这是 ICP 的基础 NFT 标准，用于创建和管理非同质化代币集合，提供基本的 NFT 功能，如铸造、转移和查询元数据。
        - ICRC-37：ICRC-7 的扩展，增加了审批工作流，允许用户授权他人代表自己转移 NFT。
        - DIP-721：早期基于以太坊 ERC-721 标准的 NFT 实现，现已被 ICRC-7 和 ICRC-37 取代，但仍有一些项目使用。
- 质押的方式
    - 通过 NNS 创建神经元，锁定 ICP，参与治理投票，获取奖励。
    - 操作流程：获取 ICP → 登录 NNS → 创建神经元 → 设置锁定期 → 投票并领取奖励。
    - 锁定期：0 天到 8 年，自由选择。
- 是否支持 Tag/Memo
    - 支持Memo，是一个 64 位无符号整数（uint64），而不是自由文本字符串。
- 是否为多链结构
    - ICP 不是传统意义上的多链，而是更接近于一种分层分布式区块链，由多个子网组成。
- 离线地址生成方
    - 已完成（createIcpAddress）
- 离线签名
- 扫链的 RPC 接口
    - 把接口参数说清楚
- 扫链回来的交易的解析

- 扫链回来的交易手续费的计算
    - ICP 的 Gas 称为Cycle，可以通过燃烧（burning）转换为 Cycles，1 ICP ≈ 1 trillion Cycles
    - Ledger 转账：固定 0.0001 ICP，由发送方支付。
    - Canister 操作：由 Cycles 支付，根据计算、存储和网络成本动态计算，由开发者预付。