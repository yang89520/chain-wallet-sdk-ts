import myLogger from "../tools/myLogger";
import * as stellarAddress from "../wallet/address"
const bip39 = require("bip39")

describe("address.test.uint", () => {
    const MNEMONIC = "birth milk retire spring doll element view elegant frown skirt example dawn"
    const PUBLICKEY = "GAZEFFEFXCG2IOM7QBICUKCO3MOL3NVT3GORVBNS7TTETRQCQDYXPOQC"
    const PRIVATEKEY = "SAP3VEQY4G6Z5PLNDF6EUQ4PGALXYHDBLUATPYAVT7VWIHOWGLS5RWP3"

    test("generateMnemonic", () => {
        const mnemonic = stellarAddress.generateMnemonic()
        //myLogger.logInfo(`mnemonic = ${mnemonic}`)
        expect(mnemonic).toBeDefined();
        expect(mnemonic.split(' ')).toHaveLength(12);
    })

    test("createAddress", () => {
        const seed = bip39.mnemonicToSeedSync(MNEMONIC, "")
        //myLogger.logInfo(`seed = ${seed.toString('hex')}`)
        const account = stellarAddress.createAddress(seed.toString('hex'), "1");
        //myLogger.logInfo(`account.publicKey = ${account.publicKey}`)
        //myLogger.logInfo(`account.privateKey = ${account.privateKey}`)
        expect(account.publicKey).toMatch(PUBLICKEY);
        expect(account.privateKey).toMatch(PRIVATEKEY);
    })

    test("importAddress", () => {
        const params = {
            privateKey : PRIVATEKEY,
            network: "testnet"
        }
        const address = stellarAddress.importAddress(params)
        //myLogger.logInfo(`address = ${address}`)
        expect(address).toMatch(PUBLICKEY);
    })

    test("verifyAddress", () => {
        const params = {
            address : PUBLICKEY,
            network: "testnet"
        }
        const verify = stellarAddress.verifyAddress(params)
        expect(verify).toBe(true);
    })
})
