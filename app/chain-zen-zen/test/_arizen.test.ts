
const zencashjs = require("zencashjs");
const axios = require("axios");
const querystring = require("querystring");
import * as dotenv from 'dotenv';
import * as wallet from "../wallet/index";
import { assert } from 'console';

var mnemonic1
var mnemonic2
beforeAll(() => {
    dotenv.config();
    mnemonic1 = process.env.MNEMONIC_1
    mnemonic2 = process.env.MNEMONIC_2
    console.log(mnemonic1)
    console.log(mnemonic2)
});

describe('zen expect run pass test', () => {
    test('send zen from arizen code', async function () {
        const fromAddress = 'znp5aYNr9f848b4pFH3pbX7wtRWrTaqb4cg'
        const toAddress = 'znVmcBG35teueHJTuB1dQuc94XY733Z1Hec'
        const fee = 0.0001
        const amount = 0.0097

        // Convert to satoshi
        let amountInSatoshi = Math.round(amount * 100000000);
        let feeInSatoshi = Math.round(fee * 100000000);
        let err = "";

        let privateKey = wallet.phraseToSecretItems(1, mnemonic1)[1].privateKey;

        const prevTxURL = "/addr/" + fromAddress + "/utxo";
        const infoURL = "/status?q=getInfo";
        const sendRawTxURL = "/tx/send";

        // Building our transaction TXOBJ
        // Calculate maximum ZEN satoshis that we have
        let satoshisSoFar = 0;
        let history = [];
        let recipients = [{ address: toAddress, satoshis: amountInSatoshi }];

        const txData = await apiGet(prevTxURL);
        const infoData = await apiGet(infoURL);

        const blockHeight = infoData.info.blocks - 300;
        const blockHashURL = "/block-index/" + blockHeight;

        const blockHash = (await apiGet(blockHashURL)).blockHash;

        // Iterate through each utxo and append it to history
        for (let i = 0; i < txData.length; i++) {
            if (txData[i].confirmations === 0) {
                continue;
            }

            if (txData[i].isCoinbase) {
                console.log("wallet.tabWithdraw.messages.isCoinbaseUTXO", "Your address contains newly mined coins, also called coinbase unspent transaction outputs (coinbase UTXO). These need to be shielded and unshielded first before they can be spent, please import the private key of this address into a full wallet like Swing and then send all your coins from this address to a Z-address and then back to this T-address. You will be then able to spend them in Arizen as well.");
                return;
            }

            history = history.concat({
                txid: txData[i].txid,
                vout: txData[i].vout,
                scriptPubKey: txData[i].scriptPubKey
            });

            // How many satoshis we have so far
            satoshisSoFar = satoshisSoFar + txData[i].satoshis;
            if (satoshisSoFar >= amountInSatoshi + feeInSatoshi) {
                break;
            }
        }

        // If we don't have enough address - fail and tell it to the user
        if (satoshisSoFar < amountInSatoshi + feeInSatoshi) {
            console.log("wallet.tabWithdraw.messages.insufficientFundsSourceAddr", "Insufficient funds on source address!");
            return;
        }

        // If we don't have exact amount - refund remaining to current address
        if (satoshisSoFar !== (amountInSatoshi + feeInSatoshi)) {
            let refundSatoshis = satoshisSoFar - amountInSatoshi - feeInSatoshi;
            recipients = recipients.concat({ address: fromAddress, satoshis: refundSatoshis });
        }

        // Create transaction
        const txobj = {
            paramIn: [
                {
                    txid: '20fb67ff4f88c191505392faf11541653a2689e5273e4235c448f810cbe81488',
                    vout: 0,
                    scriptPubKey: '76a914fc3aa8612feb28feb03efa5065d576dbb67c9f8c88ac20bdf4487b6e0b336f24e43775aa46545081f719b17e2fb1786e7a25000000000003fa441ab4'
                },
                {
                    txid: '40e2468bd53c9afef28f66367d89fc739269c3aa57fba7880c2428ee11e1fafe',
                    vout: 0,
                    scriptPubKey: '76a914fc3aa8612feb28feb03efa5065d576dbb67c9f8c88ac208a429e762f28a46da583c5a74fc93c0cfb434dbd90bfe915dbe07700000000000306441ab4'
                }],
            paramOut: [{ address: 'znp5aYNr9f848b4pFH3pbX7wtRWrTaqb4cg', satoshis: 970000 }
            ],
            blockHeight: 1721596,
            blockHash: '0000000000580b993309e9e09fbe1e7c860256b1a4e8c417bfb3dc59b201caab'
        }
        expect(history).toEqual(txobj.paramIn)
        expect(recipients).toEqual(txobj.paramOut)
        expect(typeof (history)).toEqual(typeof (txobj.paramIn))
        expect(typeof (recipients)).toEqual(typeof (txobj.paramOut))
        expect(typeof (blockHeight)).toEqual(typeof (txobj.blockHeight))
        expect(typeof (blockHash)).toEqual(typeof (txobj.blockHash))

        var typeheight = typeof (blockHeight)
        var typehash = typeof (blockHash)
        console.log(typeheight)
        console.log(typehash)

        let txObj = zencashjs.transaction.createRawTx(history, recipients, txobj.blockHeight, txobj.blockHash);
        let txObj2 = zencashjs.transaction.createRawTx(txobj.paramIn, txobj.paramOut, txobj.blockHeight, txobj.blockHash);
        expect(txObj).toEqual(txObj2)


        // Sign each history transcation
        for (let i = 0; i < history.length; i++) {
            txObj = zencashjs.transaction.signTx(txObj, i, privateKey, true);
            txObj2 = zencashjs.transaction.signTx(txObj2, i, privateKey, true);

        }
        expect(txObj).toEqual(txObj2)

        // Convert it to hex string
        const txHexString = zencashjs.transaction.serializeTx(txObj);
        const txHexString2 = zencashjs.transaction.serializeTx(txObj2);

        console.log(txHexString)
        console.log(txHexString2)

        expect(txHexString).toEqual(txHexString2)


        // const txRespData = await apiPost(sendRawTxURL, { rawtx: txHexString });

        // let message = "TXid:\n\n<small>" + txRespData.txid + "</small><br /><a href=\"javascript:void(0)\" onclick=\"openUrl('" + settings.explorerUrl + "/tx/" + txRespData.txid + "')\" class=\"walletListItemDetails transactionExplorer\" target=\"_blank\">Show Transaction in Explorer</a>";
        // console.log("send-finish", "ok", message);
    }
    );
});


let axiosApi;

const settings = {
    lang: "en",
    fiatCurrency: "USD",
    notifications: 1,
    txHistory: 50,
    autoLogOffEnable: 0,
    autoLogOffTimeout: 60,
    explorerUrl: "https://explorer.horizen.global",
    apiUrls: [
        "https://explorer.horizen.global/api",
        "https://explorer.zen-solutions.io/api"
    ],
    secureNodeFQDN: "",
    secureNodePort: 18231,
    domainFronting: false,
    domainFrontingUrl: "https://www.google.com",
    domainFrontingHost: "zendhide.appspot.com",
    refreshIntervalAPI: "334"
};


const apiUrl = settings.apiUrls[0];
console.log("Current API URL: " + apiUrl);
axiosApi = axios.create({
    baseURL: apiUrl,
    timeout: 30000,
});

async function apiGet(url) {
    const resp = await axiosApi(url);
    await sleep(parseFloat(settings.refreshIntervalAPI));
    return resp.data;
}

async function apiPost(url, form) {
    const resp = await axiosApi.post(url, querystring.stringify(form));
    await sleep(parseFloat(settings.refreshIntervalAPI));
    return resp.data;
}
function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
