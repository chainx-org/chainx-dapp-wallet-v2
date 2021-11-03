// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Routes } from './types';

import accounts from './accounts';
import addresses from './addresses';
import calendar from './calendar';
import claims from './claims';
import contracts from './contracts';
import council from './council';
import democracy from './democracy';
import explorer from './explorer';
import extrinsics from './extrinsics';
import genericAsset from './generic-asset';
import js from './js';
import parachains from './parachains';
import poll from './poll';
import rpc from './rpc';
import settings from './settings';
import signing from './signing';
import society from './society';
import staking from './staking';
import storage from './storage';
import sudo from './sudo';
import techcomm from './techcomm';
import transfer from './transfer';
import treasury from './treasury';
import trade from './trade';
import allAccounts from './allAccounts';
import mining from './mining';
import addAccount from '@polkadot/apps-routing/addAccount';
import restore from '@polkadot/apps-routing/restore';
import trust from './trust';
import chainBrowser from '@polkadot/apps-routing/chainBrowser';

export default function create(t: TFunction): Routes {
  return [
    accounts(t),
    addAccount(t),
    restore(t),
    addresses(t),
    allAccounts(t),
    staking(t),
    explorer(t),
    claims(t),
    poll(t),
    transfer(t),
    genericAsset(t),
    mining(t),
    trust(t),
    democracy(t),
    council(t),
    treasury(t),
    techcomm(t),
    parachains(t),
    society(t),
    calendar(t),
    contracts(t),
    storage(t),
    extrinsics(t),
    rpc(t),
    signing(t),
    sudo(t),
    // js(t),
    trade(t),
    settings(t),
    chainBrowser(t)

  ];
}
