module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['<rootDir>/test/fixtures'],
    coveragePathIgnorePatterns: ['<rootDir>/test/'],
    testRegex: 'test/(.+)\\.test\\.(jsx?|tsx?)$',
    setupFilesAfterEnv: ['./jest.setup.js'],
    transformIgnorePatterns: [
        "/node_modules/(?!bip32|valibot)/"  // 不跳过这些模块
    ],
    transform: {
        '^.+\\.(js|ts|tsx)$': 'babel-jest',  // 使用 babel-jest 转译 JS 和 TS 文件
    },
};