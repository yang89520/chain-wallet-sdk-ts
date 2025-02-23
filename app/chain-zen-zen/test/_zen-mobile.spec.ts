function handleSendZEN() {
    // Language stuff
    const value = this.state.sendValue
    const fee = this.state.sendFee
    const recipientAddress = this.state.addressReceive
    const senderAddress = this.props.context.address

    // Convert how much we wanna send
    // to satoshis
    const satoshisToSend = value * 100000000
    const satoshisfeesToSend = 10000 //set static fee of 0.0001

    if (recipientAddress.length !== 35) {
        errString += '\n\n'
    }

    if (typeof parseInt(value) !== 'number' || value === '') {
        errString += '\n\n'
    }

    // Can't send 0 satoshis
    if (satoshisToSend <= 0) {
        errString += '\n\n'
    }

    if (typeof parseInt(fee) !== 'number' || fee === '') {
        errString += '\n\n'
    }

    // Alert errors
    if (errString !== '') {
        alert(errString)
        this.setProgressValue(0)
        return
    }

    // Private key
    const senderPrivateKey = zencashjs.address.WIFToPrivKey(this.props.context.privateKey)

    // Get previous transactions
    const prevTxURL = urlAppend(this.props.settings.insightAPI, 'addr/') + senderAddress + '/utxo'
    const infoURL = urlAppend(this.props.settings.insightAPI, 'status?q=getInfo')
    const sendRawTxURL = urlAppend(this.props.settings.insightAPI, 'tx/send')

    // Building our transaction TXOBJ
    // How many satoshis do we have so far
    var satoshisSoFar = 0
    var history = []
    var recipients = [{ address: recipientAddress, satoshis: satoshisToSend }]

    // Get previous unspent transactions
    axios.get(prevTxURL)
        .then((txResp) => {
            this.setProgressValue(25)

            const txData = txResp.data

            // Get blockheight and hash
            axios.get(infoURL)
                .then((infoResp) => {
                    this.setProgressValue(50)
                    const infoData = infoResp.data

                    const blockHeight = infoData.info.blocks - 300
                    const blockHashURL = urlAppend(this.props.settings.insightAPI, 'block-index/') + blockHeight

                    // Get block hash
                    axios.get(blockHashURL)
                        .then((responseBhash) => {
                            this.setProgressValue(75)

                            const blockHash = responseBhash.data.blockHash

                            // Iterate through each utxo
                            // append it to history
                            for (var i = 0; i < txData.length; i++) {
                                if (txData[i].confirmations === 0) {
                                    continue
                                }

                                history = history.concat({
                                    txid: txData[i].txid,
                                    vout: txData[i].vout,
                                    scriptPubKey: txData[i].scriptPubKey
                                })

                                // How many satoshis do we have so far
                                satoshisSoFar = satoshisSoFar + txData[i].satoshis
                                if (satoshisSoFar >= satoshisToSend + satoshisfeesToSend) {
                                    break
                                }

                            }

                            // If we don't have enough address
                            // fail and tell user
                            if (satoshisSoFar < satoshisToSend + satoshisfeesToSend) {
                                this.setProgressValue(0)
                                return
                            }

                            // If we don't have exact amount
                            // Refund remaining to current address
                            if (satoshisSoFar !== satoshisToSend + satoshisfeesToSend) {
                                var refundSatoshis = satoshisSoFar - satoshisToSend - satoshisfeesToSend

                                // Refunding 'dust' (<54 satoshis will result in unconfirmed txs)
                                if (refundSatoshis > 60) {
                                    recipients = recipients.concat({ address: senderAddress, satoshis: refundSatoshis })
                                }
                            }

                            // Create transaction
                            var txObj = zencashjs.transaction.createRawTx(history, recipients, blockHeight, blockHash)

                            // Sign each history transcation
                            for (var j = 0; j < history.length; j++) {
                                txObj = zencashjs.transaction.signTx(txObj, j, senderPrivateKey, true)
                            }

                            // Convert it to hex string
                            const txHexString = zencashjs.transaction.serializeTx(txObj)

                            // Post it to the api
                            axios.post(sendRawTxURL,
                                {
                                    rawtx: txHexString
                                },
                                {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                .then((sendtxResp) => {
                                })
                                .catch((err) => {
                                })
                        }).catch((err) => {
                        })
                }).catch((err) => {
                })
        }).catch((err) => {
        })
}