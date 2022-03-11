# Chainx Update && Connect Method

ChainX is a community-driven project built on the next-generation blockchain framework substrate, the largest Layer-2
network of Bitcoin using the Light-client protocol with smart contract support, will evolve into the Polkadot network as
a secondary relay chain in the future.

### Update dependence

```
yarn add @polkadot/api @polkadot/keyring @polkadot/util @polkadot/util-crypto
```

```
//package.json
{
  //...
  "dependencies": {
    "@polkadot/api": "^7.11.1",
    "@polkadot/keyring": "^8.4.1",
    "@polkadot/util": "^8.4.1",
    "@polkadot/util-crypto": "^8.4.1"
    //...
  },
}
```

### How to connect wss node

```javascript
let api: ApiPromise

const provider = new WsProvider('wss://mainnet.chainx.org/ws')
api = new ApiPromise(({provider}))
api.on('connected', () => {
  console.log('conntect wss')
  //do something when wss connected
})
api.on('disconnected', () => {
  //do something when wss disconnected
})
api.on('error', (error: Error) => {
  // do something when wss error
})
api.on('ready', () => {
  // do something when wss ready
})
await api.isReady

// to do something
```

## Issues related to the listing of coins
### Normal judgment logic after the transaction is on the chain
- Listen for block height to get the next block height
- Get a list of transactions in the block
- Parse each transaction，if it is a transfer transaction for XAsset，Parse whether the event of this deal is the last event to be Subcess. If so, it means that it was a successful transfer transaction。
  - a. Parse the parameters of this transaction to get the sender, beneficiary address destin, received amount, asset type, remarks
  - b. If the recipient's destin is the address of interest, confirm the credit (processing the business)
- After 150 blocks, the transaction is finally confirmed to be unchangeable

```javascript
const {ApiPromise, WsProvider} = require ('@polkadot/api')

let api
(async () => {
  const provider = new WsProvider('wss://testnet3.chainx.org')
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

  const transferCallIndex = Buffer.from(api.tx.balances.transfer.callIndex).toString('hex')

  //Gets all transactions for the block
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

  // to-do  Process business logic, retrieve transactions in blocks, senders, payees, confirm credits
})()
```

### The type of transaction involving changes in the funds in the account
Transaction types involving pcx changes of users:
- Assets: User transfer
- Staking: Users vote on nodes, withdraw votes, unlock withdrawals and raise interest
- DEX: PCX-related user pending orders, cancellation orders, order transactions

Fee calculation model
```
gas=（transaction_base_fee * weight + transaction_byte_fee * len（Transaction length））* speedup
```
https://github.com/chainx-org/ChainX/wiki/%E6%89%8B%E7%BB%AD%E8%B4%B9%E6%A8%A1%E5%9E%8B#%E8%AE%A1%E7%AE%97%E6%89%8B%E7%BB%AD%E5%92%8C%E8%8E%B7%E5%8F%96%E6%89%8B%E7%BB%AD%E8%B4%B9%E5%AE%9E%E4%BE%8B

### Address generation and validation documentation links
- Address generation
```javascript
const { Keyring } = require('@polkadot/keyring');
const { mnemonicGenerate, cryptoWaitReady, signatureVerify } = require('@polkadot/util-crypto');
const { stringToU8a, u8aToHex } = require('@polkadot/util');

const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });

// generate random mnemonic
const mnemonic = mnemonicGenerate();

(async () => {
  await cryptoWaitReady();

  //create & add the pair to the keyring with the type and some additional
  const pair = keyring.addFromUri(mnemonic, { name: 'test' }, 'sr25519');

  //address: xxx
  console.log('address: ', pair.address)
  // name: test
  console.log('name: ', pair.meta.name)

  //adjust the default ss58Format for Chainx mainnet
  keyring.setSS58Format(44);
  console.log('chainx mainnet: ', pair.address)

  //adjust the default ss58Format for Chainx mainnet
  keyring.setSS58Format(42);
  console.log('chainx testnet: ', pair.address)

  //get publicKey, Uint8Array
  console.log(pair.publicKey);

  //get publicKey by decode address, Uint8Array
  console.log(keyring.decodeAddress(pair.address));

  //get publicKey by encode address
  console.log(keyring.encodeAddress(pair.publicKey, 44));
  console.log(keyring.encodeAddress(pair.publicKey, 42));

  // create the message, actual signature and verify
  const message = stringToU8a('this is our message');
  const signature = pair.sign(message);
  const isValid1 = pair.verify(message, signature, pair.publicKey);
  // output the result
  console.log(`${u8aToHex(signature)} is ${isValid1 ? 'valid' : 'invalid'}`);

  //verify the message using pair's address
  const { isValid } = signatureVerify(message, signature, pair.address);
  // output the result
  console.log(`${u8aToHex(signature)} is ${isValid ? 'valid' : 'invalid'}`);

})()
```

### Top-up processing logical document links
```javascript
const {ApiPromise, WsProvider} = require ('@polkadot/api')

let api
(async () => {
  const provider = new WsProvider('wss://testnet3.chainx.org')
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

  const transferCallIndex = Buffer.from(api.tx.balances.transfer.callIndex).toString('hex')

  //Gets all transactions for the block
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

  // to-do  Process business logic, retrieve transactions in blocks, senders, payees, confirm credits
})()
```

### Transaction construction and offline signing documents
- Transaction construction
```javascript
const {ApiPromise, WsProvider} = require ('@polkadot/api')

let api
(async () => {
  const provider = new WsProvider('wss://testnet3.chainx.org')
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

  // get account balance
  const accountAsset = await api.query.system.account(address);
  console.log('accountAsset: ', accountAsset.toJSON());

  const extrinsic = api.tx.balances.transfer(address, amount)
  console.log('Function: ', extrinsic.method.toHex());
  // Sign and send transactions 0x0000000000000000000000000000000000000000000000000000000000000000 is the private key used for signing
  await extrinsic.signAndSend('0x0000000000000000000000000000000000000000000000000000000000000000', (error, response) => {
    if (error) {
      console.log(error);
    } else if (response.status === 'Finalized') {
      if (response.result === 'ExtrinsicSuccess') {
        console.log('The transaction was successful');
      }
    }
  })
})()
```

### Official app wallets
Official wallet： http://dapps.chainx.org

Block Explorer： http://scan.chainx.org

Wallet tutorial documentation: https://chainx-doc.gitbook.io/chainx-user-guide-english/
