import myLogger from "../tools/myLogger";
import * as stellarSign from "../wallet/sign"

describe("sign.test.uint", () => {
    const PRIVATEKEY_1 = "SAP3VEQY4G6Z5PLNDF6EUQ4PGALXYHDBLUATPYAVT7VWIHOWGLS5RWP3"
    const PUBLICKEY_2 = "GAGBCUKY53UKGL2Y3N4T5CD7WG55TSLWBTT26B5MMRWAJQQP6L4HABU7"
    const SIGNVALUE = "AAAAAgAAAAAyQpSFuI2kOZ+AUCooTtscvbaz2Z0ahbL85knGAoDxdwAAAGQAEoqMAAAAEwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAAMEVFY7uijL1jbeT6If7G72cl2DOevB6xkbATCD/L4cAAAAAAAAAAAAcqG0AAAAAAAAAABAoDxdwAAAEA4PhD9q1tD1Jlr528ZfoPivn3YI1IzYWVurxHtfndkrthOAC+hfy/m8aiQlWGjusisJJ7ypSZYKyECgg95FDkJ"

    test("signTransaction", async () => {
        const params = {
            sourcePrivateKey: PRIVATEKEY_1,
            destinationAddress: PUBLICKEY_2,
            amount: "3.005",
            sequence: "5218883480846354",
            fee: 100,
            memo: "",
            isTestnet: 1
        }
        const signValue = await stellarSign.signTransaction(params)
        //myLogger.logInfo(`signValue = ${signValue}`)
        expect(signValue).toMatch(SIGNVALUE);
    })
})
