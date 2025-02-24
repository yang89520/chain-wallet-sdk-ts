https://wsg8gsxa6jir.sg.larksuite.com/docx/LpjBd8JfCoO2sLx1j88lx6qvgzb

Cosmos 钱包开发实战

1. 简介
- 核心理念：Cosmos 通过构建一个去中心化的区块链网络，让各个独立区块链能够相互通信和交换数据，从而实现真正的互联互通。这种设计旨在解决区块链生态中存在的孤岛问题，使不同区块链之间能够协同工作。
- Cosmos Hub 与 IBC：Cosmos 网络的核心是 Cosmos Hub，一个中心化的枢纽链，通过 IBC（Inter-Blockchain Communication Protocol，区块链间通信协议）与其他区块链连接。IBC 协议使得跨链资产和数据转移变得简单而安全。
IBC 协议是 Cosmos 实现不同区块链之间通信的关键。IBC 允许独立的区块链通过共享的中心枢纽进行通信和资产交换。该协议确保了跨链操作的安全性和可靠性。
- Tendermint 共识：Cosmos 采用 Tendermint 共识算法，这是一种拜占庭容错（BFT）算法，能够在较低的延迟和高吞吐量下实现安全、高效的交易确认。
- Cosmos SDK：Cosmos SDK 是一个模块化的区块链开发框架，允许开发者快速构建专用区块链。它提供了许多预构建模块，并支持自定义模块的开发，使得构建复杂应用变得更加简单。
- 生态系统与应用场景：Cosmos 生态系统内有众多独立区块链（Zone），它们可以根据各自的需求进行定制化开发，并通过 Cosmos Hub 进行互联互通。这使得 Cosmos 适用于跨链资产转移、去中心化金融（DeFi）、游戏和物联网等多种应用场景。

Cosmos 的目标是打造一个多链互联的世界，通过创新的技术架构和标准化协议，为区块链生态系统提供一个开放、互操作和可扩展的基础设施。


2. RPC URL
- https://docs.cosmos.network/api
- https://docs.cosmos.network/v0.52/learn/advanced/grpc_rest
3. 账户模型
[图片]
对于 HD 密钥派生，Cosmos SDK 使用名为 BIP32 的标准。BIP32 允许用户创建 HD 钱包（如 BIP44 中所述）——一组从初始秘密种子派生的账户。种子通常由 12 或 24 个单词的助记符创建。单个种子可以使用单向加密函数派生任意数量的 PrivKey。然后，可以从 PrivKey 派生出 PubKey。自然，助记符是最敏感的信息，因为如果助记符得以保留，私钥总是可以重新生成的。

4. 签名算法
Cosmos SDK 支持以下用于创建数字签名的数字密钥方案：
- secp256k1，如Cosmos SDKcrypto/keys/secp256k1包中实现的。
- secp256r1就像在Cosmos SDKcrypto/keys/secp256r1包中实现的那样，
- tm-ed25519，如Cosmos SDKcrypto/keys/ed25519包中实现的。此方案仅支持共识验证。
[图片]
[图片]

5. 代币精度
精度为：6
[图片]

6. 共识机制
共识是 POS + TendermintBFT

Tendermint 共识机制的特点：
- 高性能： Tendermint 能够在数秒内确认交易，适合需要快速交易确认的应用场景。
- 安全性： 通过 BFT 算法，Tendermint 能容忍最多三分之一的节点故障或恶意行为，确保网络的安全性和稳定性。
- 简洁性： Tendermint 将共识和网络层分离，使得开发者可以专注于应用层的开发，提升了开发效率。
- 可扩展性： Cosmos 通过 Tendermint 支持多链架构，各个区块链（称为“Zone”）可以独立运行，互相之间通过 IBC 协议进行通信，实现跨链互操作性。


7. 是否支持质押  
支持质押
官方文档：
https://docs.cosmos.network/v0.52/build/building-modules/msg-services


8. 是否支持代币和 NFT(合约)支持NFT和代币
官方文档：
https://docs.cosmos.network/main/build/modules/nft
x/nft是 Cosmos SDK 模块的实现，符合ADR 43，通过集成该模块，您可以创建 nft 分类、创建 nft、转移 nft、更新 nft 并支持各种查询。它与 ERC721 规范完全兼容。

9.  质押的方式
官方文档：
https://docs.cosmos.network/
https://token.im/blog/zh-cn/articles/360021917114

10. 是否支持 Tag/Memo
支持
[图片]
11. 是否为多链结构
是多链结构。
资料：
https://github.com/XChainLab/documentation/blob/master/cosmos/cosmos%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90%E4%B9%8B%E4%B8%80%E6%A6%82%E8%BF%B0.md

12. gas费计算
官方文档：https://docs.cosmos.network/main/learn/beginner/gas-fees
费用 = 消耗的 Gas * Gas 价格

13. 离线地址生成
对于用户交互，地址使用Bech32进行格式化。此格式由地址编解码器处理。Bech32 格式是与区块链交互的唯一支持格式。Bech32 （Bech32 前缀）用于表示地址类型。地址编解码器负责在二进制表示和 Bech32 字符串格式之间对地址进行编码和解码。
[图片]
助记词生成地址：
export async function generateWalletFromMnemonic(mnemonic: string) {
    // 生成种子
    const seed = mnemonicToSeedSync(mnemonic);

    // BIP32主节点
    const masterNode = bip32.fromSeed(seed);

    // 派生路径：m/44'/118'/0'/0/0 (Cosmos)
    const path = "m/44'/118'/0'/0/0";
    const child = masterNode.derivePath(path);

    if (!child.privateKey) {
        throw new Error("无法获取私钥，请检查助记词和派生路径");
    }

    // 转换为 CosmJS 所需的格式
    const privateKey = Uint8Array.from(child.privateKey);

    // 创建钱包实例
    const wallet = await Secp256k1Wallet.fromKey(privateKey, 'cosmos');
    const [account] = await wallet.getAccounts();

    // 将公钥从base64转换为16进制
    const publicKeyHex = Buffer.from(account.pubkey).toString('hex');

    return {
        privateKey: Buffer.from(privateKey).toString('hex'), // 16进制私钥
        publicKey: publicKeyHex, // 16进制公钥
        address: account.address // Bech32地址
    };
}


公钥生成地址：
export function pubkeyToAddress(hexPublicKey: string, prefix = "cosmos"): string {

    if (!/^[0-9a-fA-F]{66}$/.test(hexPublicKey)) {
        throw new Error("Invalid compressed SECP256k1 public key format");
    }


    const publicKeyBytes = fromHex(hexPublicKey);


    const shaHash = sha256(publicKeyBytes);
    const ripemdHash = ripemd160(shaHash);


    return bech32.encode(prefix, bech32.toWords(ripemdHash));
}
14. 离线签名
export async function signCosmosTransaction(params: {
    chainId: string;
    from: string;
    to: string;
    memo?: string;
    amount_in: string;
    fee: string;
    gas: string;
    accountNumber: number;
    sequence: number;
    decimal: number;
    privateKey: string;}): Promise<string> {
    // 参数验证与转换
    const amount = new BigNumber(params.amount_in)
        .shiftedBy(params.decimal)
        .toFixed(0);
    const feeAmount = new BigNumber(params.fee)
        .shiftedBy(params.decimal)
        .toFixed(0);

    // 构造交易消息
    const sendMsg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: MsgSend.fromPartial({
            fromAddress: params.from,
            toAddress: params.to,
            amount: [{ denom: "uatom", amount }]
        })
    };

    // 初始化签名客户端
    const wallet = await Secp256k1Wallet.fromKey(
        fromHex(params.privateKey),
        "cosmos"
    );
    const client = await SigningStargateClient.offline(wallet);

    // 构造签名文档
    const txRaw = await client.sign(
        params.from,
        [sendMsg],
        {
            amount: [{ denom: "uatom", amount: feeAmount }],
            gas: params.gas
        },
        params.memo || "",
        {
            chainId: params.chainId,
            accountNumber: params.accountNumber,
            sequence: params.sequence
        }
    );

    // 返回 Base64 编码交易
    return JSON.stringify({
        tx_bytes: toBase64(TxRaw.encode(txRaw).finish()),
        mode: "BROADCAST_MODE_SYNC"
    });
}
15.  扫链的 RPC 接口
15.1 account_number 和 seqence 获取
  实际构建离线交易时候的入参就是下面的seqence值+1， 和account_number值也是取自这里。
  Request
  curl --location 'https://cosmos-rest.publicnode.com/cosmos/auth/v1beta1/account_info/{address}' \
--data ''
Response:
{
    "info": {
        "address": "cosmos1akzl0vk79rtrg243z6c4s7cqvprgvky4m2d0tx",
        "pub_key": {
            "@type": "/cosmos.crypto.secp256k1.PubKey",
            "key": "AiynXl+Kh2noG3FMNkzWaFLaKSzvJgwqy+5q0+b0PuEH"
        },
        "account_number": "3255486",
        "sequence": "2"
    }
}
15.2 获取最新区块
  Request
curl --location 'https://cosmos-rest.publicnode.com/cosmos/base/tendermint/v1beta1/blocks/24491053'
Response:
{
    "block_id": {
        "hash": "hlb5YuPOUCtJMHG9uB8nbx0cnUFnSu3aqmrD+C5Hclo=",
        "part_set_header": {
            "total": 1,
            "hash": "+zXBuOXBTVD6HEfnvMXYt7m4hG9YlJhNluO3UMdfiis="
        }
    },
    "block": {
        "header": {
            "version": {
                "block": "11",
                "app": "0"
            },
            "chain_id": "cosmoshub-4",
            "height": "24491053",
            "time": "2025-02-19T17:49:29.381777606Z",
            "last_block_id": {
                "hash": "Hck2rLhRbE2Mtzc7VihvyDkGnNTqyU+9FKLAE2+x3HA=",
                "part_set_header": {
                    "total": 1,
                    "hash": "kzr39ttdrJQ98bOyf/9GmBNiomt7CpdYim/AF2eVpss="
                }
            },
            "last_commit_hash": "/ZE4JEjcR0ZXMslDuYCPIunZv7/3v1EW/SlLRZ0yYsY=",
            "data_hash": "Hx1x38opKJMJyNsU/PKDu7+cmd6Qc7KNZ5/ujG+TWfI=",
            "validators_hash": "RIcm5mVLXaJp+ZwuS5HhQT25gO0A+cZYf4bpwbK4HKs=",
            "next_validators_hash": "RIcm5mVLXaJp+ZwuS5HhQT25gO0A+cZYf4bpwbK4HKs=",
            "consensus_hash": "IMpeP0Lgegzbe9mG7/GUeiP8J/9HIEMD4IK8RLs0jgs=",
            "app_hash": "MKKOJVyQZOv3r1bU0ffZONZPOqYHoO7ak9d8/33sRsE=",
            "last_results_hash": "rZJnNkuNZWfESx//EgGqsCLY0hWSacY1RxMRnNBVsN4=",
            "evidence_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
            "proposer_address": "GuC9Qy+aUSJHSmRjJdGvpgaGkuk="
        },
        "data": {
            "txs": [
                        ...           
                            },
                {
                    "block_id_flag": "BLOCK_ID_FLAG_COMMIT",
                    "validator_address": "BvOWTk+vibfYGFJbDv1aO9KbzwE=",
                    "timestamp": "2025-02-19T17:49:29.483466695Z",
                    "signature": "2p7XDCVsGak+fBAXGcZDPrCqCUT0GTcF9ZPiaYLa3yyRKtjZcu3/cmwsLOTGY/9PMSkArEQsmc+OHT+pbx5ODA=="
                },
                {
                    "block_id_flag": "BLOCK_ID_FLAG_COMMIT",
                    "validator_address": "1/fHlIfBClzxq+sdvYHo1JdXxCI=",
                    "timestamp": "2025-02-19T17:49:29.362945406Z",
                    "signature": "BCsLBM0YasXQcpzcLdvCzhkZm0un9dADlQIJaAzw578AxjcISZoRaKWmq9koNDpyO/EypshsU8pYFd5/z1nbDA=="
                },
                {
                    "block_id_flag": "BLOCK_ID_FLAG_COMMIT",
                    "validator_address": "dc9xLAuLu+F5+zweZHeXEQxW3Ig=",
                    "timestamp": "2025-02-19T17:49:29.412077757Z",
                    "signature": "dTKRPoM1bRoVNOjlpks2FkINYSkFANSfHXQq3Iy1khxlRfLUkXLrP2Rjnud9Hkxab0+lHWRyPZ4N/kNXZcuDAA=="
                }
            ]
        }
    }
}
15.3 根据块号获取交易
  - request
curl --location 'https://cosmos-rest.publicnode.com/cosmos/base/tendermint/v1beta1/blocks/20623348' \
--data ''
  - response
{
  "block_id": {
    "hash": "Cr9rJ/PdYLz/QJQcS6Q/AJghKbWF6dvWD7LNO8ukpU0=",
    "part_set_header": {
      "total": 1,
      "hash": "pxCRahdweihOWcvXUId/8quOkq1iQd9FN5yYOkebCHM="
    }
  },
  "block": {
    "header": {
      "version": {
        "block": "11",
        "app": "0"
      },
      "chain_id": "cosmoshub-4",
      "height": "20623348",
      "time": "2024-05-28T12:39:29.860619997Z",
      "last_block_id": {
        "hash": "gbn8ySZ9MLY4Jl/TimgWKts3hiFXmF94ASFDIcT/ybw=",
        "part_set_header": {
          "total": 1,
          "hash": "uOn9tB+l+dyJuCLTzq0+5RvEFlGBBCXPfXm3yGSHGQk="
        }
      },
      "last_commit_hash": "PiCAPoXY18mOrOsi+/ngCDWF2fyTYVYz54kV74fJl+s=",
      "data_hash": "PS+gr4pphuFkMVK8C6NzjbuYHqG3Eop4M4B4pvxAkqw=",
      "validators_hash": "mF8rzuSavUuga45BXZMqCOG1sqNX2cZJf/ViVgjxxCg=",
      "next_validators_hash": "zchpzRRe3grdEiTOOS+/aO8WxjngeZNlGhE+cxkQ2ZQ=",
      "consensus_hash": "DHGkgcYVHl/p32F/XoN09hpJ6geIV5TuqUCt/SmT2f4=",
      "app_hash": "WdTmJA2XP/nEOjKSKp9zzdHnk6oqIYfp0f6Rz7v0fzM=",
      "last_results_hash": "4upz/IMEvhS3V0IIQLEbyfQhOtjf9klwr3mObDCBivA=",
      "evidence_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
      "proposer_address": "0tRY+SCey4yiqrHZngZhG4Eqh5c="
    },
    "data": {
      "txs": [
        "CqMBCqABCjcvY29zbW9zLmRpc3RyaWJ1dGlvbi52MWJldGExLk1zZ1dpdGhkcmF3RGVsZWdhdG9yUmV3YXJkEmUKLWNvc21vczFlbHVoY2czZ2c2OXlyZ2ZneHpobXo5YzNnN3E2OGVyZ2p1YXV5cRI0Y29zbW9zdmFsb3BlcjEzMG1kdTlhMGV0bWV1dzUycWZ4azczcG4wZ2E2Z2F3a3hzcmx3ZhJoClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECMuj1gq1yySK0t9md1ewoiHrDF51xQxVfumbIKHHBR/4SBAoCCH8YDxIUCg4KBXVhdG9tEgUxOTk0MBCB1zAaQBIEhgcjMywzIoDOSOSTpsPCh3usuDtINrWTA9QrL5qOYk/smgi8UvxXTFdB9pzwHSIEyG+xtb9v0R1NekPPUvM=",
        "CrsBCooBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmoKLWNvc21vczE4Y2p3ZWN4Y2c1Mmp6OTVkaHBkZzl1Y3JxM2NjeGYybHV1NjVnNRItY29zbW9zMW1ydHRhOXpjMGRzaDMwdmZkcXZmYW04a3djZ3g2cmdrYW0yam51GgoKBXVhdG9tEgExEixwcnl6bTE4Y2p3ZWN4Y2c1Mmp6OTVkaHBkZzl1Y3JxM2NjeGYybHl2ZG5rOBJnClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECjHhA4pLCWWUbidhR9yMjsBSUnSRHSrCcmuDFcj3ZMp0SBAoCCH8YAxITCg0KBXVhdG9tEgQxNjkyENqQBBpAMRNaVaMWbdUgfpiRkC9LTB93FMWztlsIaTEk82zIMzZdRch9SqKbiEH433Ar9xyPQUrsM40OUWR+rNTRlXggqw=="
      ]
    },
    "evidence": {
      "evidence": []
    },
    "last_commit": {}
  },
  "sdk_block": {

    },
    "last_commit": {}
  }
}
  - data 下面 txs：区块链里面的交易列表
15.4     根据交易 Hash 获取交易信息
  - request：
curl --location 'https://cosmos-rest.publicnode.com/cosmos/tx/v1beta1/txs/7A130735815975C1E0B741D2940055D4D227874527F97735BADD40AE2C753422
  - response
{
    "tx": {
        "body": {
            "messages": [
                {
                    "@type": "/cosmos.bank.v1beta1.MsgSend",
                    "from_address": "cosmos1akzl0vk79rtrg243z6c4s7cqvprgvky4m2d0tx",
                    "to_address": "cosmos1y2faawhl49nvwh0lzy80td6fmh53lvqrvdvsjd",
                    "amount": [
                        {
                            "denom": "uatom",
                            "amount": "10000"
                        }
                    ]
                }
            ],
            "memo": "xiuqiu",
            "timeout_height": "0",
            "extension_options": [],
            "non_critical_extension_options": []
        },
  -  返回值
  - from_address: 转出地址
  - to_address: 转入地址
  - amount：转账金额
  - memo：转账备注
  - fee：花费的手续费
15.5 获取账户余额
  - request

curl --location 'https://cosmos-rest.
    publicnode.com/cosmos/bank/v1beta1/
    balances/
    cosmos1akzl0vk79rtrg243z6c4s7cqvprgvky4
    m2d0tx'
  - response
{
    "balances": [
        {
            "denom": "uatom",
            "amount": "264354"
        }
    ],
    "pagination": {
        "next_key": null,
        "total": "1"
    }
}

15.6 广播交易
- request

curl --location 'https://cosmos-rest.publicnode.com/cosmos/tx/v1beta1/txs' \
--header 'Content-Type: application/json' \
--data '    {"tx_bytes":"CpkBCo4BChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEm4KLWNvc21vczFha3psMHZrNzlydHJnMjQzejZjNHM3Y3F2cHJndmt5NG0yZDB0eBItY29zbW9zMXkyZmFhd2hsNDludndoMGx6eTgwdGQ2Zm1oNTNsdnFydmR2c2pkGg4KBXVhdG9tEgUxMDAwMBIGMTAxMTExEmcKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQIsp15fiodp6BtxTDZM1mhS2iks7yYMKsvuatPm9D7hBxIECgIIARgBEhMKDQoFdWF0b20SBDEwMDAQkJ4HGkBBSRZy0VNO9xoHGX0Kj3mSDhDkwrveXididtcVrZ56liCyzOQjIdUU48ZxWoll6imLjXdGU0e32F+g03/RQKwv","mode":"BROADCAST_MODE_SYNC"}
'
- response
{
    "tx_response": {
        "height": "0",
        "txhash": "7A130735815975C1E0B741D2940055D4D227874527F97735BADD40AE2C753422",
        "codespace": "",
        "code": 0,
        "data": "",
        "raw_log": "",
        "logs": [],
        "info": "",
        "gas_wanted": "0",
        "gas_used": "0",
        "tx": null,
        "timestamp": "",
        "events": []
    }
}

15.7 交易解码
- request
curl --location 'https://cosmos-rest.publicnode.com/cosmos/tx/v1beta1/decode' \
--header 'Content-Type: application/json' \
--data '{"tx_bytes":"CpkBCo4BChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEm4KLWNvc21vczFha3psMHZrNzlydHJnMjQzejZjNHM3Y3F2cHJndmt5NG0yZDB0eBItY29zbW9zMXkyZmFhd2hsNDludndoMGx6eTgwdGQ2Zm1oNTNsdnFydmR2c2pkGg4KBXVhdG9tEgUxMDAwMBIGMTAxMTExEmcKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQIsp15fiodp6BtxTDZM1mhS2iks7yYMKsvuatPm9D7hBxIECgIIARgBEhMKDQoFdWF0b20SBDEwMDAQkJ4HGkBBSRZy0VNO9xoHGX0Kj3mSDhDkwrveXididtcVrZ56liCyzOQjIdUU48ZxWoll6imLjXdGU0e32F+g03/RQKwv","mode":"BROADCAST_MODE_SYNC"}'
- response
{
    "tx": {
        "body": {
            "messages": [
                {
                    "@type": "/cosmos.bank.v1beta1.MsgSend",
                    "from_address": "cosmos1akzl0vk79rtrg243z6c4s7cqvprgvky4m2d0tx",
                    "to_address": "cosmos1y2faawhl49nvwh0lzy80td6fmh53lvqrvdvsjd",
                    "amount": [
                        {
                            "denom": "uatom",
                            "amount": "10000"
                        }
                    ]
                }
            ],
            "memo": "101111",
            "timeout_height": "0",
            "extension_options": [],
            "non_critical_extension_options": []
        },
        "auth_info": {
            "signer_infos": [
                {
                    "public_key": {
                        "@type": "/cosmos.crypto.secp256k1.PubKey",
                        "key": "AiynXl+Kh2noG3FMNkzWaFLaKSzvJgwqy+5q0+b0PuEH"
                    },
                    "mode_info": {
                        "single": {
                            "mode": "SIGN_MODE_DIRECT"
                        }
                    },
                    "sequence": "1"
                }
            ],
            "fee": {
                "amount": [
                    {
                        "denom": "uatom",
                        "amount": "1000"
                    }
                ],
                "gas_limit": "118544",
                "payer": "",
                "granter": ""
            },
            "tip": null
        },
        "signatures": [
            "QUkWctFTTvcaBxl9Co95kg4Q5MK73l4nYnbXFa2eepYgsszkIyHVFOPGcVqJZeopi413RlNHt9hfoNN/0UCsLw=="
        ]
    }
}

16. cosmos对应的面试题

17. 资料链接
- 区块链浏览器：https://www.oklink.com/zh-hans/cosmos
- 官网：https://cosmos.network/
- github:https://github.com/cosmos/
- 电报群：https://t.me/cosmosproject
- reddit：https://reddit.com/r/cosmosnetwork
- twitter：https://twitter.com/cosmos
- slideshare：https://www.slideshare.net/tendermint
- API 文档：https://docs.cosmos.network/api#tag/Query/operation/AllBalances
- Tendermint API 文档：https://docs.cometbft.com/main/rpc/#/Info/status