import { KeyPair, transactions, utils } from "near-api-js";
import { createHash } from "crypto";

// ...existing code...

export function signTransaction(
	privateKey: string,
	sender: string,
	receiver: string,
	nonce: number,
	blockHash: string,
	actions: transactions.Action[]
): string {
	const keyPair = KeyPair.fromString(privateKey);
	const publicKey = keyPair.getPublicKey();
	const decodedBlockHash = utils.serialize.base_decode(blockHash);
	const tx = transactions.createTransaction(
		sender,
		publicKey,
		receiver,
		nonce,
		actions,
		decodedBlockHash
	);
	const serializedTx = utils.serialize.serialize(transactions.SCHEMA, tx);
	const txHash = createHash("sha256").update(serializedTx).digest();
	const signature = keyPair.sign(txHash);
	const signedTx = new transactions.SignedTransaction({
		transaction: tx,
		signature: new transactions.Signature({
			keyType: publicKey.keyType,
			data: signature.signature,
		}),
	});
	const serializedSignedTx = utils.serialize.serialize(transactions.SCHEMA, signedTx);
	return Buffer.from(serializedSignedTx).toString("base64");
}

// ...existing code...
