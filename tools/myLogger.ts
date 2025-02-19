// tools/myLogger.ts

const writeLine = (message: string) => process.stdout.write(message + '\n');

// 可以扩展更多日志级别或方法
const logInfo_0 = (message: string) => writeLine(`${message}`);
const logInfo = (message: string) => writeLine(`INFO: ${message}`);
const logError = (message: string) => writeLine(`ERROR: ${message}`);
const logWarning = (message: string) => writeLine(`WARNING: ${message}`);

export default { logInfo_0, logInfo, logError, logWarning };