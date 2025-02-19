import {mnemonicToSeed} from '../wallet/bip/bip';
import {createAddress, importAddress, signTransaction, signTransactiongrpc} from '../wallet';

const dotenv = require('dotenv');

// 加载.env文件
dotenv.config();

describe('oasis unit test case', () => {

    test('createAddress', async () => {
        // 从环境变量中读取助记词
        const mnemonic = process.env.MNEMONIC;
        if (!mnemonic) {
            throw new Error('MNEMONIC environment variable is not set');
        }
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = mnemonicToSeed(params_1)
        const account = await createAddress(seed.toString("hex"), 0)
        console.log(account)
    });

    test('importAddress', async () => {
        const privateKey = process.env.SRC_PRIVATE_KEY;
        const adderss = await importAddress(privateKey);
        console.log(adderss)
    });

    test('sign transaction grpc', async () => {
        const params = {
            srcPrivateKey: process.env.SRC_PRIVATE_KEY,
            disPrivateKey: process.env.DIS_PRIVATE_KEY,
        };
        let signed = await signTransactiongrpc(params);
        console.log(signed)
    });

    test('sign transaction', async () => {
        const params = {
            privateKey: process.env.SRC_PRIVATE_KEY,
            chainContext: process.env.CHAIN_CONTEXT,
            gas: 1569,
            nonce: 16,
            toAddress: process.env.TO_ADDRESS,
            amount: 0.05,
        };
        let signed = await signTransaction(params);
        console.log(signed)
    });


});
