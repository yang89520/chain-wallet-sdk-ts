import { AccountKey, Signature, Transaction} from '../common/model';
import { transactionSignature } from './signature';
import { encodeTransactionEnvelope, encodeTransactionPayload } from '../common/enode';
const utils = require('../common/utils');




export function signTransaction(transaction: Transaction, payloadSignatures: AccountKey[], envelopeSignatures: AccountKey[]): Transaction {
  const tr = transaction;
  const payloadSigs: Signature[] = [];
  payloadSignatures.forEach((ps) => {
    const payloadMsg = encodeTransactionPayload({
      script: tr.script.toString('utf-8'),
      arguments: tr.arguments,
      refBlock: tr.reference_block_id.toString('hex'),
      gasLimit: tr.gas_limit,
      proposalKey: {
        address: tr.proposal_key.address,
        key_id: tr.proposal_key.key_id,
        sequence_number: tr.proposal_key.sequence_number,
      },
      payer: tr.payer.toString('hex'),
      authorizers: tr.authorizers.map((x) => x.toString('hex')),
    });
    const thisSig = transactionSignature(payloadMsg, utils.fromHex(ps.private_key),"","");
    tr.payload_signatures.push({ address: Buffer.from(<string>ps.address, 'hex'), key_id: <number>ps.id, signature: Buffer.from(thisSig, 'hex') });
    payloadSigs.push({ address: <string>ps.address, keyId: <number>ps.id, sig: thisSig });
  });
  envelopeSignatures.forEach((es) => {
    const envelopeMsg = encodeTransactionEnvelope({
      script: tr.script.toString('utf-8'),
      arguments: tr.arguments,
      refBlock: tr.reference_block_id.toString('hex'),
      gasLimit: tr.gas_limit,
      proposalKey: {
        address: tr.proposal_key.address,
        key_id: tr.proposal_key.key_id,
        sequence_number: tr.proposal_key.sequence_number,
      },
      payer: tr.payer.toString('hex'),
      payload_signatures: payloadSigs,
      authorizers: tr.authorizers.map((x) => x.toString('hex')),
    });
    const thisSig = transactionSignature(envelopeMsg, utils.fromHex(es.private_key),"","");
    tr.envelope_signatures.push({ address: utils.fromHex(es.address), key_id: es.id, signature: utils.fromHex(thisSig) });
  });
  return tr;
};