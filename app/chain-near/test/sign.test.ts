// @ts-ignore
import assert from "assert";
// @ts-ignore
import BN from "bn.js";
import { transactions } from "near-api-js";
import { signTransaction } from "../wallet/sign";
import { importPrivateKey } from "../wallet/address";


describe("Offline Transaction Signing", () => {
	test("should sign a transaction and return a non-empty base64 string", () => {
		const privateKey = "ed25519:ypXJ5bx2T3sQu1ewwjua4za8zuAtgRyutHJTthqRiPyiebkATXpYy2KwjdLpDc8QgbRQutruyqoaUpU5wErgewb";
        const keyPair = importPrivateKey(privateKey);
        const sender = "20b9bdf32f768ac6e6ff3c9ab512d4bd7f94dbcf4e9d15bb8cd3c3b4062d585a";
		const receiver = "receiver.testnet";
		const nonce = 140083597000003 + 1;
		// Dummy block hash: a 32-byte string in base58 (for test only).
		const blockHash = "AfiYwwX4owsv4crEFfRTHYA1dw4asMVUjfo8cmkbYQ9k";
		// Create a dummy transfer action.
		const action = transactions.transfer(new BN("1000000000000000000000"));
		const signedTx = signTransaction(privateKey, sender, receiver, nonce, blockHash, [action]);
        console.log(signedTx);
		assert.ok(typeof signedTx === "string" && signedTx.length > 0, "Signed transaction should be non-empty");
	});
});

