# NEAR Wallet SDK

This project provides utilities and functionalities for working with NEAR blockchain. It includes functions for creating addresses, importing private keys, and signing transactions offline.

## Features

- **NEAR**
  - Generate NEAR addresses
  - Import private keys to generate NEAR addresses
  - Sign NEAR transactions offline

## Installation

To install the dependencies, run:

```bash
npm install
```

## Usage

### Generate NEAR Address

```typescript
import { generateAddress } from './src/address';

const keyPair = generateAddress();
console.log(keyPair.getPublicKey().toString());
console.log(keyPair.toString());
```

### Import Private Key to Generate NEAR Address

```typescript
import { importPrivateKey } from './src/address';

const privateKey = "your private key here";
const keyPair = importPrivateKey(privateKey);
console.log(keyPair.getPublicKey().toString());
console.log(keyPair.toString());
```

### Sign NEAR Transaction Offline

```typescript
import { signTransaction } from './src/sign';
import { transactions } from "near-api-js";
import BN from "bn.js";

const privateKey = "your private key here";
const sender = "sender.testnet";
const receiver = "receiver.testnet";
const nonce = 1;
const blockHash = "11111111111111111111111111111111"; // Dummy block hash for test
const action = transactions.transfer(new BN("1000000000000000000000000"));
const signedTx = signTransaction(privateKey, sender, receiver, nonce, blockHash, [action]);
console.log(signedTx);
```

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

## License

This project is licensed under the ISC License.
