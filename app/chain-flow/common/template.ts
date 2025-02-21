export const CreateAccountTql ="import Crypto\n" +
    "  transaction(publicKeys: [Crypto.KeyListEntry], contracts: {String: String}) {\n" +
    "         prepare(signer: auth(BorrowValue) &Account) {\n" +
    "            let account = Account(payer: signer)\n" +
    "            // add all the keys to the account\n" +
    "            for key in publicKeys {\n" +
    "                account.keys.add(publicKey: key.publicKey, hashAlgorithm: key.hashAlgorithm, weight: key.weight)\n" +
    "                    // add contracts if provided\n" +
    "                for contract in contracts.keys {\n" +
    "                    account.contracts.add(name: contract, code: contracts[contract]!.decodeHex())\n" +
    "                }\n" +
    "            }\n" +
    "      }\n" +
    "  }"


export const TransferTpl = "import FungibleToken from 0xf233dcee88fe0abe\n" +
    "import FlowToken from 0x1654653399040a61\n" +
    "\n" +
    "import EVM from 0xe467b9dd11fa00df\n" +
    "\n" +
    "transaction(amount: UFix64,to: String) {\n" +
    "\n" +
    "    let sentVault: @FlowToken.Vault\n" +
    "    let evmRecipient: EVM.EVMAddress?\n" +
    "    var receiver: &{FungibleToken.Receiver}?\n" +
    "\n" +
    "    prepare(signer: auth(BorrowValue, SaveValue) &Account) {\n" +
    "        // Reference signer's FlowToken Vault\n" +
    "        let sourceVault = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)\n" +
    "            ?? panic(\"Could not borrow signer's FlowToken.Vault\")\n" +
    "\n" +
    "        // Init receiver as nil\n" +
    "        self.receiver = nil\n" +
    "        // Ensure address is prefixed with '0x'\n" +
    "        let withPrefix = to.slice(from: 0, upTo: 2) == \"0x\" ? to : \"0x\".concat(to)\n" +
    "        // Attempt to parse address as Cadence or EVM address\n" +
    "        let cadenceRecipient = withPrefix.length < 40 ? Address.fromString(withPrefix) : nil\n" +
    "        self.evmRecipient = cadenceRecipient == nil ? EVM.addressFromString(withPrefix) : nil\n" +
    "\n" +
    "        // Validate exactly one target address is assigned\n" +
    "        if cadenceRecipient != nil && self.evmRecipient != nil {\n" +
    "            panic(\"Malformed recipient address - assignable as both Cadence and EVM addresses\")\n" +
    "        } else if cadenceRecipient == nil && self.evmRecipient == nil {\n" +
    "            panic(\"Malformed recipient address - not assignable as either Cadence or EVM address\")\n" +
    "        }\n" +
    "\n" +
    "        if cadenceRecipient != nil {\n" +
    "            // Assign FungibleToken Receiver if recipient is a Cadence address\n" +
    "            self.receiver = getAccount(cadenceRecipient!).capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)\n" +
    "                ?? panic(\"Could not borrow FungibleToken Receiver from recipient\")\n" +
    "        }\n" +
    "\n" +
    "        // Create empty FLOW vault to capture funds\n" +
    "        self.sentVault <- sourceVault.withdraw(amount: amount) as! @FlowToken.Vault\n" +
    "    }\n" +
    "\n" +
    "    pre {\n" +
    "        self.receiver != nil || self.evmRecipient != nil: \"Could not assign a recipient for the transfer\"\n" +
    "        self.sentVault.balance == amount: \"Attempting to send an incorrect amount of $FLOW\"\n" +
    "    }\n" +
    "\n" +
    "    execute {\n" +
    "        // Complete Cadence transfer if the FungibleToken Receiver is assigned\n" +
    "        if self.receiver != nil {\n" +
    "            self.receiver!.deposit(from: <-self.sentVault)\n" +
    "        } else {\n" +
    "            // Otherwise, complete EVM transfer\n" +
    "            self.evmRecipient!.deposit(from: <-self.sentVault)\n" +
    "        }\n" +
    "    }\n" +
    "}"
