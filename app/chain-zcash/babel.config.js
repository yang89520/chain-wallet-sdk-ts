module.exports = {
    presets: [
        "@babel/preset-env",  // 转译现代 JavaScript
        "@babel/preset-typescript"  // 如果你使用 TypeScript
    ],
    // 确保 Babel 处理所有依赖中的文件
    overrides: [
        {
            test: /node_modules/,
            presets: [
                ["@babel/preset-env", { "targets": "> 0.25%, not dead" }]
            ]
        }
    ]
};