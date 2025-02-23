
const zencashjs = require("zencashjs");
const axios = require("axios");
const querystring = require("querystring");
import * as dotenv from 'dotenv';
import * as wallet from "../wallet/index";

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
        const amount = 0.009

        try {
            // Convert to satoshi
            let amountInSatoshi = Math.round(amount * 100000000);
            let feeInSatoshi = Math.round(fee * 100000000);
            let err = "";

            let privateKey = wallet.phraseToSecretItems(0, mnemonic1)[0].privateKey;

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
            let txObj = zencashjs.transaction.createRawTx(history, recipients, blockHeight, blockHash);

            // Sign each history transcation
            for (let i = 0; i < history.length; i++) {
                txObj = zencashjs.transaction.signTx(txObj, i, privateKey, true);
            }

            // Convert it to hex string
            const txHexString = zencashjs.transaction.serializeTx(txObj);
            // const txRespData = await apiPost(sendRawTxURL, { rawtx: txHexString });

            // let message = "TXid:\n\n<small>" + txRespData.txid + "</small><br /><a href=\"javascript:void(0)\" onclick=\"openUrl('" + settings.explorerUrl + "/tx/" + txRespData.txid + "')\" class=\"walletListItemDetails transactionExplorer\" target=\"_blank\">Show Transaction in Explorer</a>";
            // console.log("send-finish", "ok", message);
        }
        catch (e) {
            console.log("send-finish", "error", e.message);
            console.log(e);
        }
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
