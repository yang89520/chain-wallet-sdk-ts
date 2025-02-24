import {
    generateWalletFromMnemonic, signCosmosTransaction , pubkeyToAddress
} from "../wallet";



describe('atom unit test case', () => {
    test('should generate correct key pair from mnemonic', async () => {

        const mnemonic = "chair spare know ugly journey disagree tape chimney column betray ramp pear";
        console.log("\n=== generate   wallet ===");

        const wallet = await generateWalletFromMnemonic(mnemonic);

        console.log("\ngenerate results：");
        console.log("Private Key (hex):", wallet.privateKey);
        console.log("Public Key:", wallet.publicKey);
        console.log("Address:", wallet.address);
        console.log("\n=== generation completed ===\n");

    //       mnemonic : "chair spare know ugly journey disagree tape chimney column betray ramp pear"
    //       privateKey: 'dbd4a79fe8b003ba0815a08ac3d4a9e940cd8346149b72f5f710a8963ef70c4f',
    //       publicKey: '022ca75e5f8a8769e81b714c364cd66852da292cef260c2acbee6ad3e6f43ee107',
    //       address: 'cosmos1akzl0vk79rtrg243z6c4s7cqvprgvky4m2d0tx'

    });

    test("sign cosmos transaction", async () => {
        const params = {
            privateKey: "dbd4a79fe8b003ba0815a08ac3d4a9e940cd8346149b72f5f710a8963ef70c4f",
            chainId: "cosmoshub-4",
            from: "cosmos1akzl0vk79rtrg243z6c4s7cqvprgvky4m2d0tx",
            to: "cosmos1y2faawhl49nvwh0lzy80td6fmh53lvqrvdvsjd",
            memo: "xiuqiu",
            amount_in: "0.01",
            fee: "0.01",
            gas: "120544",
            accountNumber: 3255486,
            sequence: 3,
            decimal: 6
        };

        const signedTx = await signCosmosTransaction(params);
        console.log("signTx:", signedTx);
    });

    test("publicKeyToAddress", async () => {
        const publicKey = "022ca75e5f8a8769e81b714c364cd66852da292cef260c2acbee6ad3e6f43ee107";
        console.log(pubkeyToAddress(publicKey));
    });
});

