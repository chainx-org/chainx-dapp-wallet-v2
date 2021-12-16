// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { chainColors, nodeColors, specColors } from './colors';
import { identityNodes, identitySpec } from './identityIcons';
import { sanitize } from './util';

export * from './logos';

export function getSystemIcon (systemName: string, specName: string): 'beachball' | 'polkadot' | 'substrate' {
  return (
    identityNodes[sanitize(systemName)] ||
    identitySpec[sanitize(specName)] ||
    'substrate'
  ) as 'substrate';}

export function getSystemChainColor (systemChain: string, systemName: string, specName: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (
    chainColors[sanitize(systemChain)] ||
    nodeColors[sanitize(systemName)] ||
    specColors[sanitize(specName)]
  );}
