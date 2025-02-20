// @ts-ignore
import assert from "assert";
import { generateNearAccount, importPrivateKey } from "../wallet/address";

// ...existing code...

describe("Address Module Tests", () => {
	test("should generate a valid key pair", () => {
		const account = generateNearAccount();
        console.log(account);
    });

	test("should import private key and produce a matching key pair", () => {
		const originalKeyPair = generateNearAccount();
		const secretKeyStr = originalKeyPair.privateKey;
		const importedKeyPair = importPrivateKey(secretKeyStr);
		assert.strictEqual(
			originalKeyPair.publicKey,
			importedKeyPair.publicKey,
			"Imported key pair should have matching public key"
		);
	});

    test("should import private key and produce a matching key pair", () => {
		const importedKeyPair = importPrivateKey("ed25519:ypXJ5bx2T3sQu1ewwjua4za8zuAtgRyutHJTthqRiPyiebkATXpYy2KwjdLpDc8QgbRQutruyqoaUpU5wErgewb");
		console.log("importedKeyPair: ", importedKeyPair);
        assert.strictEqual(
			"ed25519:3CkKR2ej2ZXEQh7tY8bkVkVqi2zkt31svaA3Mj3v3pnm",
			importedKeyPair.publicKey,
			"Imported key pair should have matching public key"
		);
	});
});

// ...existing code...
