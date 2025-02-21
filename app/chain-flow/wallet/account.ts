import { Transaction } from '../common/model';
import {CreateAccountTql,TransferTpl} from '../common/template'

const utils =require('../common/utils');
const DefaultAccountIndex = 0
const ContractsParam = `{"type":"Dictionary","value":[]}`





//创建账户交易
export function CreateNewAccountTx(publicKeyHex: string, payer: string, referenceBlockIDHex: string, payerSequenceNumber: number, gasLimit: number): Transaction {
  const payerAddress = utils.fromHex(payer)
  const pubKeyBytes = utils.fromHex(publicKeyHex)
  const pubKeyParam = publicKey2Param(pubKeyBytes)

  return {
    script:           Buffer.from(CreateAccountTql),
    arguments:        [Buffer.from(pubKeyParam), Buffer.from(ContractsParam)],
    reference_block_id: utils.fromHex(referenceBlockIDHex),
    gas_limit:         gasLimit,
    proposal_key: {
      address:         payerAddress,
      key_id:          DefaultAccountIndex,
      sequence_number: payerSequenceNumber,
    },
    payer:              payerAddress,
    authorizers:       [payerAddress],
    payload_signatures:  [],
    envelope_signatures: [],
  }
}

//创建转账交易
export function CreateTransferTx(amount: string, toAddr: string, payer: string, referenceBlockIDHex: string, payerSequenceNumber: number, gasLimit: number): Transaction {
  const payerAddress = utils.fromHex(payer)

  const amountParam = `{"type":"UFix64","value":"${amount}"}`
  const addrParam = `{"type":"String","value":"${toAddr}"}`

  return {
    script:           Buffer.from(TransferTpl),
    arguments:        [Buffer.from(amountParam), Buffer.from(addrParam)],
    reference_block_id: utils.fromHex(referenceBlockIDHex),
    gas_limit:         gasLimit,
    proposal_key: {
      address:         payerAddress,
      key_id:          DefaultAccountIndex,
      sequence_number: payerSequenceNumber,
    },
    payer:              payerAddress,
    authorizers:       [payerAddress],
    payload_signatures:  [],
    envelope_signatures: [],
  }
}


export function CreateTx(script: Buffer, args: Buffer[], payer: string, referenceBlockIDHex: string, payerSequenceNumber: number, gasLimit: number): Transaction {
  const payerAddress = utils.fromHex(payer)

  return {
    script:           script,
    arguments:        args,
    reference_block_id: utils.fromHex(referenceBlockIDHex),
    gas_limit:         gasLimit,
    proposal_key: {
      address:         payerAddress,
      key_id:          DefaultAccountIndex,
      sequence_number: payerSequenceNumber,
    },
    payer:              payerAddress,
    authorizers:       [payerAddress],
    payload_signatures:  [],
    envelope_signatures: [],
  }
}

function publicKey2Param(key: Buffer): string {
  const vList: any = []
  key.forEach((value: number) => {
    vList.push({"type": "UInt8", "value": "" + value})
  })
  const p = JSON.stringify(vList)
  return `{"type":"Array","value":[{"type":"Struct","value":{"id":"I.Crypto.Crypto.KeyListEntry","fields":[{"name":"keyIndex","value":{"type":"Int","value":"1000"}},{"name":"publicKey","value":{"type":"Struct","value":{"id":"PublicKey","fields":[{"name":"publicKey","value":{"type":"Array","value":${p}}},{"name":"signatureAlgorithm","value":{"type":"Enum","value":{"id":"SignatureAlgorithm","fields":[{"name":"rawValue","value":{"type":"UInt8","value":"1"}}]}}}]}}},{"name":"hashAlgorithm","value":{"type":"Enum","value":{"id":"HashAlgorithm","fields":[{"name":"rawValue","value":{"type":"UInt8","value":"3"}}]}}},{"name":"weight","value":{"type":"UFix64","value":"1000.00000000"}},{"name":"isRevoked","value":{"type":"Bool","value":false}}]}}]}`
}