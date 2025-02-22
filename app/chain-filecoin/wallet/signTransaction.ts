import { FilecoinSigner } from '@blitslabs/filecoin-js-signer';
import BigNumber from 'bignumber.js'

// initial filecoinSigner
const filecoinSigner = new FilecoinSigner();

// construct trasaction message
const createTransferMessage = (from, to, amount, nonce) => {
    return {
        From: from,
        To: to,
        Nonce: nonce, // 必须手动维护正确的nonce
        Value: new BigNumber(amount),
        GasLimit: 1000000000, // 需合理估算
        GasFeeCap: new BigNumber(100000), // 单位attoFIL
        GasPremium: new BigNumber(10000),
        Method: 0, // 0表示普通转账
        Params: ''
    }
}

// signTransactionOffline
// @ts-ignore
 function signTransactionOffline(unsignedMessage:createTransferMessage, privateKey:string) :string {
    return  filecoinSigner.tx.transactionSignLotus(
        unsignedMessage,
        privateKey
    )
}

//construct offline trasaction
export function executeOfflineSigning(from:string, to:string, amount:string, nonce:string,privateKey:string) :string{

    const rawMessage = createTransferMessage(
        from,
        to,
        amount,
        nonce
    )
    // signedMessage
    let signedMessage =  signTransactionOffline(rawMessage, privateKey);

    return signedMessage;
}

