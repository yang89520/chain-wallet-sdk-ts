import {
    Networks,
    Keypair,
    Account,
    Asset,
    TransactionBuilder,
    Operation,
    Transaction,
    Memo,
    TimeoutInfinite,
    BASE_FEE
} from "@stellar/stellar-sdk";

export async function signTransaction(params: any) {
    const { sourcePrivateKey, destinationAddress, amount, sequence, fee, memo, isTestnet } = params;
    const targetNetwork = isTestnet ? Networks.TESTNET: Networks.PUBLIC

    const keyPair = Keypair.fromSecret(sourcePrivateKey)
    const sourceAccount = new Account(keyPair.publicKey(), sequence.toString());

    let amountString = amount.toString()
    let assetType = Asset.native()

    const tx = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        memo: memo,
        networkPassphrase :targetNetwork
        })
        .addOperation(
            Operation.payment({
                amount : amountString,
                asset : assetType,
                destination: destinationAddress
            })
        )
        .setTimeout(TimeoutInfinite)
        .build()

    tx.sign(keyPair);

    return tx.toEnvelope().toXDR('base64')
}
