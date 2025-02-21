import { keyDerive } from '../wallet/createAddress';



describe('filecoin unit test case', () => {
    test('createAddress f1', () => {
        //const mnemonic = "sort what document outdoor plastic little country witness output beauty upon pudding";
        const mnemonic = "puzzle inhale piece memory slot timber peanut enact post depth kit tomorrow";
        const i = 0;
        const account = keyDerive(mnemonic, `m/44'/461'/0'/0/${i}` ,  "mainnet");
        console.log(account);

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



        // KeyPair {
        //       _publicKey: '0448fd425b0d4725ca35e926310103cc979584afce7e964d7ea30ac69c88e7896d6f40e94a7eb005e9d82707734b11cbd80e3c1ad06a1a7db0024ca448b7dc2c41',
        //       _privateKey: '549b5b010cfe326c5ddd0eec11132a6e6ad9a4ba3118b3e0bc466094123eb4e2',
        //       _address: 't1p5dkn7uogxgx4bb2f2zjxgitwih3fp7wm2tiida'
       //                   f1p5dkn7uogxgx4bb2f2zjxgitwih3fp7wm2tiida
        //     }

        // KeyPair {
        //       _publicKey: '042701b184f499e02dd8e1e843825e27a3f00781abd028d16967227645bc626b1abfa49b917905e73150c63f95f65f03be9421e6c6d4a74aa6ece1fa61fe870bb3',
        //       _privateKey: 'a3cbb7626cb36ab07730fc7c133bdd0b0d4021c20664b5999f8ee5631f13e6ca',
        //       _address: 'f1mi7o32335gq56ijddycu5betuut4adeqwbf6fai'
        //     }
    });
});
