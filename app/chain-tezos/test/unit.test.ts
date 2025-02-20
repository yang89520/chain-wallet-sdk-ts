import {createAccountByMnemonic,sign} from "../wallet"
import { localForger } from '@taquito/local-forging';

describe('tezos wallet test',()=>{
    test("create account test",()=>{
        const mnemonic = "confirm return system rely maple hold sleep panda stomach laptop pole erase";
        const account = createAccountByMnemonic(mnemonic,"0");
        console.log(account)
    })

    const privateKey = 'edskRnPTo5USByDmkrtddbfnm5TC5iMpqYCELJ8jRDxAmvuytYYyEE7BpeA4BXE6rF55BUc4rQLbi1rNrkx5Zai2xnovjb4iSt';
    // 构建交易内容（转账）
    const transaction = {
        branch: "BLskBbZLKvRMe3TNc2Ca3CZw39pS937xkVK5fBehKXLPzuFVZaJ",  // 当前区块的哈希（需要获取当前区块哈希）
        protocol: "",
        contents: [
            {
                kind: "transaction",
                source: "tz1dCztCWFnbvX66Tnyp8R6QB8k6azrD7i3x",  // 发送方地址
                fee: "50000",  // 交易费用（单位：mutez，1tez = 1000000 mutez）
                counter: "156726389",
                gas_limit: "20000",
                storage_limit: "0",
                destination: "tz1iPCKqRmQum2mMYpxu77WVQ1w7NxG1xn2M",  // 接收方地址
                amount: "10000",  // 转账金额（单位：mutez）
            }
        ],
        signature: ""
    };

    test('sign transaction test',async ()=> {
// @ts-ignore
        const bytes = await localForger.forge(transaction)
        console.log("forge: ",bytes)
        const signed = await sign(bytes, privateKey);
        const signTransactionBytes = signed.sbytes;
        console.log("signTransactionBytes: ",JSON.stringify(signTransactionBytes))
        transaction.signature = signed.prefixSig;
        transaction.protocol = "PsQuebecnLByd3JwTiGadoG4nGWi3HYiLXUjkibeFV8dCFeVMUg";
        console.log("transaction: ",JSON.stringify(transaction))
    })
})