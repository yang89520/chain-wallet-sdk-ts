import { Interface } from '@ethersproject/abi';
import { FeeMarketEIP1559Transaction, Transaction } from '@ethereumjs/tx'
import * as bip from '../bip/bip';
import Common from '@ethereumjs/common'
import * as ethers from 'ethers';
import BigNumber from 'bignumber.js';

export function numToHex(value: any) {
    const number = new BigNumber(value);
    const result = number.toString(16);
    return '0x' + result;
}

export function generateMnemonic(number?: number | 12, language?: string) {
    if (!language) {
        language = 'english'
    }
    return bip.generateMnemonic({ number: 12, language: language })
}

export function createZenWalletByWord(mnemonic: string, language?: string) {
    if (!language) {
        language = 'english'
    }
    const flag = bip.validateMnemonic({ mnemonic: mnemonic, language: language })
    if (!flag) {
        throw new Error('Invalid mnemonic')
    }

    const seed = bip.mnemonicToSeed({ mnemonic: mnemonic, password: '' })
    return createZenAddressBySeedHex(seed.toString("hex"), '0', mnemonic)
}

function createZenAddressBySeedHex(seedHex: string, addressIndex: string, mnemonic: string) {
    const hdNode = ethers.utils.HDNode.fromSeed(Buffer.from(seedHex, 'hex'));
    const {
        privateKey,
        publicKey,
        address
    } = hdNode.derivePath("m/44'/60'/0'/0/" + addressIndex + '');
    return {
        mnemonic,
        privateKey,
        publicKey,
        address
    };
}

export function zenSign(params: any) {
    let { privateKey, nonce, from, to, gasPrice, gasLimit, amount, tokenAddress, decimal, maxPriorityFeePerGas, maxFeePerGas, chainId, data } = params;
    const transactionNonce = ethers.utils.hexValue(nonce);
    const gasLimits = ethers.utils.hexValue(gasLimit);
    const chainIdHex = ethers.utils.hexValue(chainId);
    let newAmount = new BigNumber(amount).times((new BigNumber(10).pow(decimal)));
    // console.log(newAmount)
    const numBalanceHex = numToHex(newAmount);
    let txData: any = {
        nonce: transactionNonce,
        gasLimit: gasLimits,
        to,
        from,
        chainId: chainIdHex,
        value: numBalanceHex
    }
    if (maxFeePerGas && maxPriorityFeePerGas) {
        txData.maxFeePerGas = ethers.utils.hexValue(maxFeePerGas);
        txData.maxPriorityFeePerGas = ethers.utils.hexValue(maxPriorityFeePerGas);
    } else {
        txData.gasPrice = ethers.utils.hexValue(gasPrice);
    }
    if (tokenAddress && tokenAddress !== "0x00") {
        const ABI = [
            "function transfer(address to, uint amount)"
        ];
        const iface = new Interface(ABI);
        txData.data = iface.encodeFunctionData("transfer", [to, numBalanceHex]);
        txData.to = tokenAddress;
        txData.value = 0;
    }
    if (data) {
        txData.data = data;
    }
    let common: any, tx: any;
    if (txData.maxFeePerGas && txData.maxPriorityFeePerGas) {
        common = (Common as any).custom({
            chainId: chainId,
            defaultHardfork: "london"
        });
        tx = FeeMarketEIP1559Transaction.fromTxData(txData, {
            common
        });
    } else {
        common = (Common as any).custom({ chainId: chainId })
        tx = Transaction.fromTxData(txData, {
            common
        });
    }
    const privateKeyBuffer = Buffer.from(privateKey.split('0x')[1], "hex");
    const signedTx = tx.sign(privateKeyBuffer);
    const serializedTx = signedTx.serialize();
    if (!serializedTx) {
        throw new Error("sign is null or undefined");
    }
    return `0x${serializedTx.toString('hex')}`;
}

export function importZenWallet(privateKey: string) {
    const param = ethers.utils.arrayify(privateKey)
    const wallet = new ethers.Wallet(param);
    return {
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        address: wallet.address
    };
}

export function verifyAddress(address: string) {
    return ethers.utils.isAddress(address);
}

export function publicKeyToAddress(publicKey: string) {
    return ethers.utils.computeAddress(publicKey);
}
