import {mnemonicToSeed, createIcpAddress, importIcpAddress, verifyIcpAddress} from "../wallet";

const dotenv = require('dotenv');

dotenv.config();

describe('icp unit test case', () => {

    test('Hello World', async () => {
        console.log("hello wallet sdk")
    })

    test("createAddress", () => {
        const params = {
            mnemonic: process.env.MNEMONIC,
            password: ""
        }
        const seed = mnemonicToSeed(params);
        const accountInfo = createIcpAddress(seed, "0");
        console.log(accountInfo);
    });

    test('importAddress', () => {
        const params = {
            privateKey: process.env.PRIVATE_KEY,
        }
        let accountInfo = importIcpAddress(params);
        console.log(accountInfo);
    });

    test('verifyAddress', () => {
        const params = {
            principalText: process.env.PRINCIPAL,
            accountText: process.env.ACCOUNT,
        }
        let isMatch = verifyIcpAddress(params);
        console.log(isMatch);
    })

});