// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component, { useCounter } from '@polkadot/app-transactionList';

export default function create(t: TFunction): Route {
  return {
    Component,
    display: {},
    group: 'network',
    icon: 'certificate',
    name: 'transactionList',
    text: t('nav.transactionList', 'TransactionList', { ns: 'apps-routing' }),
    useCounter
  };
}
