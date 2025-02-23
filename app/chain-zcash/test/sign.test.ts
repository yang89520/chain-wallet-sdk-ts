import {buildAndSignTx} from "../src/sign"
const utxolib = require("@bitgo/utxo-lib")

describe('buildAndSignTx test case', () => {
    test('offline sign tx', async () => {
        const data = {
            inputs: [
                // amount must be full of the  UTXO!!! or else it will crush!
                {
                    address: "t1QzsGFr2iNTxNGAmhw2Nv8P85BG9XU31JJ",
                    txid: "5b0191406c2ffa0fc7fe5af68c53c41ab5aa6012a1b619b3c8376911957883da",
                    amount: 4258340,
                    vout: 0,
                },
            ],

            outputs: [
                {
                    amount: 3834556,
                    address: "t1JM4tZ6anzxXs5bJxGFkA7wYfUkdjoQkCp",
                },
            ],
        };

        // call signature
        const rawHex = buildAndSignTx({
            privateKey:"L3QNfJsKpnjFYjNPzYRKM12re4mTPsJjfFKyVe25VFVg4hRZVzcD",
            signObj: data,
            network: utxolib.networks.zcash,
        });
        console.log(rawHex);
    });
});
