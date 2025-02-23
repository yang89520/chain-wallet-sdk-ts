import { keyDerive ,executeOfflineSigning} from '../wallet/index';
const dotenv = require('dotenv');

dotenv.config();

describe('filecoin unit test case', () => {
    test('createAddress f1', () => {
        const mnemonic = process.env.MNEMONIC;
        const i = 0;
        const account = keyDerive(mnemonic, `m/44'/461'/0'/0/${i}` ,  "mainnet");
        console.log(account);
    });
});

describe('filecoin unit test case', () => {
    test('signTransaction f1', () => {
        // @ts-ignore
        const signMessage = executeOfflineSigning('f1p5dkn7uogxgx4bb2f2zjxgitwih3fp7wm2tiida', 'f1mi7o32335gq56ijddycu5betuut4adeqwbf6fai', 100000000000, 2,process.env.PRIVATE_KEY);
        console.log("测试==="+signMessage);
    });
});
