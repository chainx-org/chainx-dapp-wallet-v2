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
const { ApiBase, HttpProvider, WsProvider } = require('chainx.js');

(async () => {
  //...
  // connect websocket
  await api.isReady;
  const transferCallIndex = Buffer.from(api.tx.xAssets.transfer.callIndex).toString('hex');

  let latestHeight = null;
  let unsubscribeNewHead = null
  function getUnSubscribeNewHeadFunction() {
     return unsubscribeNewHead
  }
  async function updateHeight() {
    const api = await getApi()
     unsubscribeNewHead = await api.rpc.chain.subscribeNewHeads(header => {
    latestHeight = header.number.toNumber()
    //console.log('latestHeight', latestHeight)
  })
  }
  // Gets all transactions in the current block
  async function getTransfers(blockNumber) {
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

  //Update the chunk height
  updateHeight()
  console.log("Get the latest in-block transactions:" + latestHeight )
  //Get the latest in-block transactions
  const transfers = await getTransfers(latestHeight);

  console.log(JSON.stringify(transfers));
  // to-do something： Process business logic, retrieve transactions in blocks, senders, payees, confirm credits
})();
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
const { Account } = require('chainx.js');

const account1 = Account.generate();

const publicKey1 = account1.publicKey(); // publicKey
console.log('publicKey1: ', publicKey1);

const privateKey1 = account1.privateKey(); // privateKey
console.log('privateKey1: ', privateKey1);

const address1 = account1.address(); // address
console.log('address1: ', address1);

const mnemonic = Account.newMnemonic(); // Random mnemonics
console.log('mnemonic: ', mnemonic);

const account2 = Account.from(mnemonic); // Generate an account from mnemonics

const address2 = Account.encodeAddress(account2.publicKey()); // Generate an address from the public key
console.log('address2: ', address2);

const publicKey2 = Account.decodeAddress(address2); // Get the generated public key from the address
console.log('publicKey2: ', publicKey2);

Account.setNet('testnet'); // Set to TestNet
const address3 = Account.encodeAddress(publicKey2); // Testnet address
console.log('address3:', address3);

Account.setNet('mainnet'); // Set to the home network
const address4 = Account.encodeAddress(publicKey2); // Mainnet address
console.log('address4:', address4);

const account3 = Account.from(privateKey1); // Generate an account from the private key
console.log('address:', account3.address()); // address
```

- Address legitimacy check
```javascript
const { Account } = require('chainx.js');
Account.isAddressValid('xxx')  //return true , Indicates that the address is legitimate
```

### Top-up processing logical document links
```javascript
const { ApiBase, HttpProvider, WsProvider } = require('chainx.js');
(async () => {
  // ...
  // connect websocket
  // const api = new ApiBase(new WsProvider('wss://w1.chainx.org.cn/ws'))
  await api.isReady;
  const transferCallIndex = Buffer.from(api.tx.xAssets.transfer.callIndex).toString('hex');
  //The latest block height
  let latestHeight = null;
  let unsubscribeNewHead = null

  function getUnSubscribeNewHeadFunction() {
     return unsubscribeNewHead
  }
  async function updateHeight() {
    const api = await getApi()
     unsubscribeNewHead = await api.rpc.chain.subscribeNewHeads(header => {
    latestHeight = header.number.toNumber()
    //console.log('latestHeight', latestHeight)
  })
  }
  // Gets all transactions in the current block
  async function getTransfers(blockNumber) {
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
  //update chunks
  updateHeight()
  console.log("最新区块高度:" + latestHeight )
  //Get the latest in-block transactions
  const transfers = await getTransfers(latestHeight);
  console.log(JSON.stringify(transfers));
  // to-do  Process business logic, retrieve transactions in blocks, senders, payees, confirm credits
  })();
```

### Transaction construction and offline signing documents
- Transaction construction
```javascript
const Chainx = require('chainx.js').default;

(async () => {
  //...
  // connect websocket
  // 等待异步的初始化
  await api.isRpcReady();

  // Query the assets of an account
  const bobAssets = await api.asset.getAssetsByAccount('5DtoAAhWgWSthkcj7JfDcF2fGKEWg91QmgMx37D6tFBAc6Qg', 0, 10);

  console.log('bobAssets: ', JSON.stringify(bobAssets));

  // Constructing trading parameters (synchronization)

  const extrinsic = api.asset.transfer('5DtoAAhWgWSthkcj7JfDcF2fGKEWg91QmgMx37D6tFBAc6Qg', 'PCX', '1000', '转账 PCX');

  // View the method hash
  console.log('Function: ', extrinsic.method.toHex());

  //Signing and sending transactions, 0x0000000000000000000000000000000000000000000000000000000000000000 is the private key used for signing
  extrinsic.signAndSend('0x0000000000000000000000000000000000000000000000000000000000000000', (error, response) => {
    if (error) {
      console.log(error);
    } else if (response.status === 'Finalized') {
      if (response.result === 'ExtrinsicSuccess') {
        console.log('交易成功');
      }
    }
  });
})();
```

- Offline signature
```javascript
const Chainx = require('chainx.js').default;
const nacl = require('tweetnacl');

// The signing process
async function ed25519Sign(message) {
  // The 32-bit private key of the signature account
  const privateKey = Buffer.from('5858582020202020202020202020202020202020202020202020202020202020', 'hex');
  // Sign using the ed25519 algorithm. tweetnacl, This signature uses a 64-bit secretKey，it is effectively equal to privateKey + publicKey。By this method nacl.sign.keyPair.fromSeed，The secretKey can be obtained from the privateKey。
  return nacl.sign.detached(message, nacl.sign.keyPair.fromSeed(privateKey).secretKey);
}

(async () => {
  //...
  //connect websocket

  await api.isRpcReady();
  const address = '5CjVPmj6Bm3TVUwfY5ph3PE2daxPHp1G3YZQnrXc8GDjstwT';
  // Vote to raise interest
  const extrinsic = api.stake.voteClaim(address);
  // Get the number of transactions on that account
  const nonce = await extrinsic.getNonce(address);
  // Get the original text to be signed
  // Parameters can be passed in： extrinsic.encodeMessage(address, { nonce, acceleration = 1, blockHash = genesisHash, era = '0x00' })
  const encoded = extrinsic.encodeMessage(address, { nonce, acceleration: 10 });
  // Offline signing
  const signature = await ed25519Sign(encoded);
  // Inject signatures
  extrinsic.appendSignature(signature);
  // Data sent to the chain
  // console.log(extrinsic.toHex())
  // Send extrinsic
  extrinsic.send((error, result) => {
    console.log(error, result);
  });
})();
```

### Official app wallets
Official wallet： http://dapps.chainx.org

Block Explorer： http://scan.chainx.org

Wallet tutorial documentation: https://chainx-doc.gitbook.io/chainx-user-guide-english/
