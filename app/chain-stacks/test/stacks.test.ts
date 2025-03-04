import StacksSDK, {
  StacksNetwork,
  IStacksWallet,
  ISignedTransaction
} from '../wallet';

describe('Stacks SDK', () => {
  let sdk: StacksSDK;

  beforeEach(() => {
    console.log('\n初始化 SDK (测试网)...');
    sdk = new StacksSDK(StacksNetwork.Testnet);
  });

  describe('助记词功能', () => {
    test('生成有效助记词', () => {
      const mnemonic = sdk.generateMnemonic();
      console.log('生成的助记词:', mnemonic);

      const isValid = sdk.validateMnemonic(mnemonic);
      expect(isValid).toBe(true);
      expect(mnemonic.split(' ').length).toBe(12); // 验证是12个单词
    });

    test('验证无效助记词', () => {
      const invalidMnemonic = 'invalid mnemonic phrase';
      console.log('验证无效助记词:', invalidMnemonic);

      const isValid = sdk.validateMnemonic(invalidMnemonic);
      expect(isValid).toBe(false);
    });
  });

  describe('钱包功能', () => {
    test('生成新钱包', async () => {
      const wallet = await sdk.generateWallet();
      console.log('新钱包地址:', wallet.address);

      expect(wallet).toMatchObject({
        privateKey: expect.any(String),
        publicKey: expect.any(String),
        address: expect.stringMatching(/^ST[A-Z0-9]{39}$/)
      });
    });

    test('从助记词导入钱包', async () => {
      // 使用12个单词的标准助记词
      const testMnemonic = 'order verify swear disease range prosper trend regret session warfare silent circle';
      console.log('导入助记词:', testMnemonic);

      const wallet = await sdk.generateWallet(testMnemonic);
      console.log('导入钱包地址:', wallet.address);
      console.log('生成地址长度', wallet.address.length);
      expect(wallet).toMatchObject({
        privateKey: expect.any(String),
        publicKey: expect.any(String),
        address: expect.stringMatching(/^ST[A-Z0-9]{39}$/)
      });
    });
  });

  describe('地址功能', () => {
    // const validAddress = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    // const invalidAddress = 'invalid_address';
    const validAddress = 'ST140ZW67MQKGXE2HS2X4E4DQ9AG4XXE8YGKHCTAV';
    const invalidAddress = 'invalid_address';

    test('验证有效地址', () => {
      console.log('验证地址:', validAddress);
      expect(sdk.validateAddress(validAddress)).toBe(true);
    });

    test('验证无效地址', () => {
      console.log('验证地址:', invalidAddress);
      expect(sdk.validateAddress(invalidAddress)).toBe(false);
    });
  });

  describe('账户功能', () => {
    let testWallet: IStacksWallet;

    beforeEach(async () => {
      testWallet = await sdk.generateWallet();
      console.log('\n测试钱包地址:', testWallet.address);
    });

    test('查询账户余额', async () => {
      const balance = await sdk.getBalance(testWallet.address);
      console.log('账户余额:', balance);
      expect(typeof balance).toBe('string');
    });

    test('获取账户 Nonce', async () => {
      const nonce = await sdk.getNonce(testWallet.address);
      console.log('账户 Nonce:', nonce);
      expect(typeof nonce).toBe('number');
    });

    test('获取交易历史', async () => {
      const history = await sdk.getTransactionHistory(testWallet.address);
      console.log('交易历史数量:', history.length);
      expect(Array.isArray(history)).toBe(true);
      history.forEach(tx => {
        expect(tx).toMatchObject({
          txId: expect.any(String),
          type: expect.any(String),
          status: expect.any(String),
          timestamp: expect.any(Number)
        });
      });
    });

    test('获取账户资产', async () => {
      const assets = await sdk.getAssets(testWallet.address);
      console.log('资产数量:', assets.length);
      expect(Array.isArray(assets)).toBe(true);
      assets.forEach(asset => {
        expect(asset).toMatchObject({
          assetId: expect.any(String),
          amount: expect.any(String),
          type: expect.any(String)
        });
      });
    });
  });

  describe('交易功能', () => {
    let testWallet: IStacksWallet;

    beforeEach(async () => {
      testWallet = await sdk.generateWallet();
      console.log('\n测试钱包地址:', testWallet.address);
    });

    test('签名转账交易', async () => {
      const tx = await sdk.signTransaction({
        from: testWallet.address,
        to: 'ST140ZW67MQKGXE2HS2X4E4DQ9AG4XXE8YGKHCTAV',
        amount: 1000000, // 1 STX = 1,000,000 μSTX
        nonce: 0,
        fee: 1000, // 0.001 STX = 1000 μSTX
        memo: '测试转账'
      }, testWallet.privateKey);

      console.log('交易ID:', tx.txId);
      console.log('txHex', tx.txHex)
      expect(tx).toMatchObject({
        txHex: expect.any(String),
        txId: expect.stringMatching(/^0x[a-f0-9]{64}$/)
      });
    });

    test('构建合约调用交易', async () => {
      const tx = await sdk.buildContractCall(
        'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
        'test-contract',
        'test-function',
        ['arg1', 'arg2'],
        testWallet.privateKey
      );

      console.log('交易ID:', tx.txId);
      expect(tx).toMatchObject({
        txHex: expect.any(String),
        txId: expect.stringMatching(/^0x[a-f0-9]{64}$/)
      });
    });
  });
});
