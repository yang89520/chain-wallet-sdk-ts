import assert from "assert";
import { generateAddress, importPrivateKey } from "../src/address";

// ...existing code...

describe("Address Module Tests", () => {
	test("should generate a valid key pair", () => {
		const keyPair = generateAddress();
		const publicKeyStr = keyPair.getPublicKey().toString();
		const secretKeyStr = keyPair.toString();
		assert.ok(publicKeyStr.startsWith("ed25519:"), "Public key should start with 'ed25519:'");
		assert.ok(secretKeyStr.includes("ed25519:"), "Secret key should include 'ed25519:'");
	});
	
	test("should import private key and produce a matching key pair", () => {
		const originalKeyPair = generateAddress();
		const secretKeyStr = originalKeyPair.toString();
		const importedKeyPair = importPrivateKey(secretKeyStr);
		assert.strictEqual(
			originalKeyPair.getPublicKey().toString(),
			importedKeyPair.getPublicKey().toString(),
			"Imported key pair should have matching public key"
		);
	});
});

// ...existing code...
