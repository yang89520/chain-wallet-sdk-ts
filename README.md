# chain-wallet-sdk

## 1.代码编写规则

- 将调研的报告放在 reports 目录下
- 将开发的钱包的 sdk 放到 app 目录下
- 若自己有编码的依赖库，可以放到 libs 目录

## 2.运行项目

- 克隆项目
```
git clone git@github.com:the-web3/chain-wallet-sdk.git
```

- 安装依赖
```
cd chain-wallet-sdk
pnpm install 
```

- 运行全部子项目测试文件
```
pnpm test 
```

- 构建项目
```
pnpm build 
```


- 指定运行子项目测试(xxx换成项目名称)
```
pnpm --filter xxx run test  
```



