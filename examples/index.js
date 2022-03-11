const {ApiPromise, WsProvider} = require ('@polkadot/api')

let api
(async () => {
  const provider = new WsProvider('wss://mainnet.chainx.org/ws')
  api = new ApiPromise(({provider}))
  api.on('connected', () => {
    console.log('connect wss')
  })
  api.on('disconnected', () => {})
  api.on('error', (error) => {})
  api.on('ready', () => {
    console.log('connect ready')
  })
  await api.isReady

  async function getTransfers() {
    //Gets the current latest block height
    const blockNumber = await api.derive.chain.bestNumber()
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    const block = await api.rpc.chain.getBlock(blockHash);
    const estrinsics = block.block.extrinsics;
    const transfers = [];
    for (let i = 0; i < estrinsics.length; i++) {
      const e = estrinsics[i];
      if (Buffer.from(e.method.callIndex).toString('hex') === transferCallIndex) {
        const allEvents = await api.query.system.events.at(blockHash);
        events = allEvents
          .filter(({ phase }) => phase.type === 'ApplyExtrinsic' && phase.value.eqn(i))
          .map(event => {
            const o = event.toJSON();
            o.method = event.event.data.method;
            return o;
          });
        result = events[events.length - 1].method;

        transfers.push({
          index: i,
          blockHash: blockHash.toHex(),
          blockNumber: blockNumber,
          result,
          tx: {
            signature: e.signature.toJSON(),
            method: e.method.toJSON(),
          },
          events: events,
          txHash: e.hash.toHex(),
        });
      }
    }
    return transfers;
  }
  const transfers = await getTransfers()

  //Sign and send transactions
  async function signAndSendExtrinsic() {
    // get account balance
    const accountAsset = await api.query.system.account('5VLqoJHjoTM4xT2fHB3KdzyjH8ryXySHraBFP2E9haKg1ewF');
    console.log('bobAssets: ', accountAsset.toJSON());

    const extrinsic = api.tx.balances.transfer('5VLqoJHjoTM4xT2fHB3KdzyjH8ryXySHraBFP2E9haKg1ewF', 1)
    console.log('Function: ', extrinsic.method.toHex());
    // Sign and send transactions 0x0000000000000000000000000000000000000000000000000000000000000000 is the private key used for signing
    await extrinsic.signAndSend('0x0000000000000000000000000000000000000000000000000000000000000000', (error, response) => {
      if (error) {
        console.log(error);
      } else if (response.status === 'Finalized') {
        if (response.result === 'ExtrinsicSuccess') {
          console.log('交易成功');
        }
      }
    })
  }

  signAndSendExtrinsic()
})()

