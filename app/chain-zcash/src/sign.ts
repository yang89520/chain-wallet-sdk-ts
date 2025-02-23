
const utxolib = require("@bitgo/utxo-lib")

// build and gign transaction
export function buildAndSignTx(params: {privateKey: string; signObj: any; network: string}): string {
    const {privateKey, signObj, network} = params;
    const builder = utxolib.bitgo.createTransactionBuilderForNetwork(network);
    signObj.inputs.forEach(input => {
        const script = utxolib.address.toOutputScript(input.address, network);
        builder.addInput(input.txid , input.vout,undefined, script,input.amount);
    })
    signObj.outputs.forEach(output => {
       const  outPublicKey = utxolib.address.toOutputScript(output.address, network);
        builder.addOutput(outPublicKey,output.amount);
    })
    const keyPair = utxolib.ECPair.fromWIF(privateKey);
    for (let i = 0; i < signObj.inputs.length; i++) {
        const signArg = {
            prevOutScriptType: 'p2pkh',
            vin: signObj.inputs[i].vout,
            keyPair: keyPair,
        };
        builder.sign(signArg);
    }
    const transaction = builder.build()
    return transaction.toHex()
}


