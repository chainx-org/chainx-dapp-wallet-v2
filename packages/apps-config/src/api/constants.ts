// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { selectableNetworks } from '@polkadot/networks';

import { assert } from '@polkadot/util';

const chainNetwork = {
  decimals: [18],
  displayName: "chainx",
  genesisHash: ["0x96e71a7ab978721be3c56721a369cbc65aab400db757dfd71c6eaae0b1783b8b"],
  icon: "chainx",
  network: "chainx",
  prefix: 2,
  standardAccount: "*25519",
  symbols: ["KSX"],
  website: "https://chainx.org",
  hasLedgerSupport: true, 
  isIgnored: false, 
  isTestnet: false,
}
selectableNetworks.push(chainNetwork)

function getGenesis (name: string): string {
  const network = selectableNetworks.find(({ network }) => network === name);

  assert(network && network.genesisHash[0], `Unable to find genesisHash for ${name}`);

  return network.genesisHash[0];
}
export const KUSAMA_GENESIS = getGenesis('kusama');

export const POLKADOT_GENESIS = getGenesis('polkadot');
export const POLKADOT_DENOM_BLOCK = new BN(1248328);
export const CHAINX_GENESIS = getGenesis('chainx')
export const KULUPU_GENESIS = getGenesis('kulupu');
export const ROCOCO_GENESIS = '0x037f5f3c8e67b314062025fc886fcd6238ea25a4a9b45dce8d246815c9ebe770';

export const WESTEND_GENESIS = '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e';

export const NEATCOIN_GENESIS = '0xfbb541421d30423c9a753ffa844b64fd44d823f513bf49e3b73b3a656309a595';

export const DOCK_GENESIS = '0x6bfe24dca2a3be10f22212678ac13a6446ec764103c0f3471c71609eac384aae';

export const DOCK_POS_TESTNET_GENESIS = '0x59d93e2ce42abb8aa52ca9a9e820233667104751f8f2980578a47a26a7235027';

export const NFTMART_GENESIS = '0xfcf9074303d8f319ad1bf0195b145871977e7c375883b834247cb01ff22f51f9';
