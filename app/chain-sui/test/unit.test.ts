import { createSuiAddress, importSuiAddress, verifySuiAddress, signSuiTransaction } from "../wallet";


describe('sui unit test case', () => {
    test('create sui address', () => {
        const mnemonic = "sort what document outdoor plastic little country witness output beauty upon pudding";
        const account = createSuiAddress(mnemonic, "0", "0", "mainnet")
        console.log(account)
    });

    test('import sui Address', () => {
        const params = {
            privateKey: "3cab28745f6b32e5907c9eeb028a181f55980c0d3c752f524e7e82046b6358a0",
            network: "mainnet"
        }
        const account = importSuiAddress(params)
        console.log(account)
    });

    test('verify sui address', async () => {
        const params = {
            address: "0xae55cf204c405303eecf16fc1d6db7932a0502444b58cc1a9d0960f8e7e7e68e",
            network: "mainnet"
        }
        let verifyRes = verifySuiAddress(params)
        console.log(verifyRes);
    });

    /*
     * {
     *     privateKey: '3cab28745f6b32e5907c9eeb028a181f55980c0d3c752f524e7e82046b6358a0',
     *     publicKey: 'f2c30828567600cb7219277abc56c32b7dd8006ef863dca4190a3a5095be02f2',
     *     address: '0x10320a8ecffb7c93f7edbdb402a2d3f7772cb125e88e7d8011cb6bf0e4a3cc5e'
     * }
    */
    test('sign', async () => {
        const data = {
            "from": "0x10320a8ecffb7c93f7edbdb402a2d3f7772cb125e88e7d8011cb6bf0e4a3cc5e",
            "outputs": [
                {
                    "requestId": "thejob20241111",
                    "to": "0x2db4fe25bd4d25be3b8007db0078efa736050029ab1a92eeb211f44840d3742a",
                    "amount": "0.01"
                },
                {
                    "requestId": "dao12111",
                    "to": "0xedf8a58ff4de17638526aa0804e87fa992ef02cc1af1147d4d7f8a843f621a21",
                    "amount": "0.01"
                }
            ],
            "decimal": 9,
            "coinRefs": [
                {
                    "objectId": "0x1f3d3c882ca3402ffd935a19b060412e24582f191eaf632d57a8696548ad34fe",
                    "version": 315156593,
                    "digest": "HQGMv6CUHv1vYVJAFaRh8jFdnupZt64gSdzcKaTapehV"
                }
            ],
            "gasBudget": 9580000,
            "gasPrice": 2000
        };
        const rawHex = await signSuiTransaction({
            privateKey: "3cab28745f6b32e5907c9eeb028a181f55980c0d3c752f524e7e82046b6358a0",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });
});

