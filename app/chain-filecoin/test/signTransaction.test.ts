import { executeOfflineSigning } from '../wallet/signTransaction';



describe('filecoin unit test case', () => {
    test('signTransaction f1', () => {

        // @ts-ignore
        //let signMessage = executeOfflineSigning('f1p5dkn7uogxgx4bb2f2zjxgitwih3fp7wm2tiida', 'f1mi7o32335gq56ijddycu5betuut4adeqwbf6fai', 100000000000, 0,'549b5b010cfe326c5ddd0eec11132a6e6ad9a4ba3118b3e0bc466094123eb4e2');
        const signMessage = executeOfflineSigning('f1p5dkn7uogxgx4bb2f2zjxgitwih3fp7wm2tiida', 'f1mi7o32335gq56ijddycu5betuut4adeqwbf6fai', 100000000000, 2,'549b5b010cfe326c5ddd0eec11132a6e6ad9a4ba3118b3e0bc466094123eb4e2');
        console.log("测试"+signMessage);

        try {
            // 解析 JSON 字符串
            const parsedData = JSON.parse(signMessage);

            console.log(parsedData);
            const parsedDataJSON = JSON.parse(parsedData);
            // 提取 Signature.Data 字段的值
            const base64Data = parsedDataJSON.Signature.Data;
            console.log(base64Data);

          /*  // 1. Base64 解码为二进制 Buffer
            const rawTxBytes = Buffer.from(base64Data, 'base64');

            // 2. 转换为十六进制字符串并添加 0x 前缀
            const hexData = '0x' + rawTxBytes.toString('hex');

            // 打印 data 部分
            console.log("Parsed data:", hexData);

            // 打印结果
            console.log("Base64 Data:", base64Data);
            console.log("Ethereum Address:", hexData);*/

        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
        // 主网KeyPair {
        //       _publicKey: '04aa669f014c59dba28bdfc1273dd176a5a39a8e3735b47dde501579222f1ea9eecd23cb815a486d2f072a4b274e78256b0426036b1a7ea8c7e4a214d281888058',
        //       _privateKey: '6676f4873a925169b1f22de078b348228b0623b5dca9a46550a0b3d570152653',
        //       _address: 'f1rys3afcmrhyn4vxrjurvjacfrnspgsc5q5oewfi'
        //     }
        //测试KeyPair {
        //       _publicKey: '04aa669f014c59dba28bdfc1273dd176a5a39a8e3735b47dde501579222f1ea9eecd23cb815a486d2f072a4b274e78256b0426036b1a7ea8c7e4a214d281888058',
        //       _privateKey: '6676f4873a925169b1f22de078b348228b0623b5dca9a46550a0b3d570152653',
        //       _address: 't1rys3afcmrhyn4vxrjurvjacfrnspgsc5q5oewfi'
            //水龙头  bafy2bzacebiaxxouvyeg5xvnrliosiagx5obthm4xgggp4qpdiez6zmwypapu
        //     }
    });
});
//{"Message":{"From":"f1p5dkn7uogxgx4bb2f2zjxgitwih3fp7wm2tiida","GasLimit":800000,"GasFeeCap":"100","GasPremium":"10","Method":0,"Nonce":1,"Params":"","To":"f1mi7o32335gq56ijddycu5betuut4adeqwbf6fai","Value":"100000000000"},"Signature":{"Data":"yDgdnM4hctZErimxAkGA6T7g30Q8RM3Q+n7cruhwkkBTGkODxLquHrEEKOcKJyYdImjpKh96BGvu9sh99FxSfQE=","Type":1}}


