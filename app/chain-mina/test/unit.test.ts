import { createMinaAddress} from "../wallet";
import { Client } from 'mina-signer'


describe('mina unit test case', () => {

    test('Hello World', async () => {
        console.log("hello wallet sdk")
    })

    test("createAddress", () => {

        const accountInfo = createMinaAddress(process.env.MNEMONIC,"mainnet");
        console.log(accountInfo);
    });


});


it('generates a signed transaction by using signTransaction', () => {
    const client = new Client({ network: "mainnet" })
    const payment = client.signTransaction(
        {
            to: "B62qqGs6KzQQxYzdzqqcyMZckhPjanzL7jKtvTCCNYW73KULsoRZ1JM",
            from: "B62qqbQcWRYVnm3R9NiG8xr2254kazNcC4PPPY7pjopUMKvJ87iza5v",
            amount: '1',
            fee: '1000000',
            nonce: 1,
        },
        process.env.PRIVATE_KEY
    );
    console.log(payment);
    expect(payment.data).toBeDefined();
    expect(payment.signature).toBeDefined();
});