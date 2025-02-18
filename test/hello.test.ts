import myLogger from "../tools/myLogger";

describe("hello.test.uint", () => {
    test("hello.test", () => {
        myLogger.logInfo(`hello.test 1`)
        myLogger.logWarning(`hello.test 2`)
        myLogger.logError(`hello.test 3`)
    })
})
