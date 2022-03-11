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

  //do something
})()

