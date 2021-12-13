// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { selectableNetworks } from '@polkadot/networks';

import { assert } from '@polkadot/util';

const chainNetwork = {
  decimals: [8],
  displayName: "chainx",
  genesisHash: ["0x6ac13efb5b368b97b4934cef6edfdd99c2af51ba5109bfb8dacc116f9c584c10"],
  icon: "chainx",
  network: "chainx",
  prefix: 2,
  standardAccount: "*25519",
  symbols: ["PCX"],
  website: "https://chainx.org",
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
