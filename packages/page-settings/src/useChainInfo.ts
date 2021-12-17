// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainInfo } from './types';

import { useMemo } from 'react';

import { getSystemChainColor, getSystemIcon } from '@polkadot/apps-config';
import { getSpecTypes } from '@polkadot/types-known';
import { DEFAULT_DECIMALS, DEFAULT_SS58, registry } from '@polkadot/react-api';
import { useApi } from '@polkadot/react-hooks';
import { formatBalance, isNumber } from '@polkadot/util';
import { base64Encode } from '@polkadot/util-crypto';

export default function useChainInfo (): ChainInfo | null {
  const { api, isApiReady, isEthereum, specName, systemChain, systemName } = useApi();

  return useMemo(
    () => isApiReady
      ? {
        chain: systemChain,
        chainType: isEthereum ? 'ethereum' : 'substrate',
        color: getSystemChainColor(systemChain, systemName, specName),
        genesisHash: api.genesisHash.toHex(),
        icon: getSystemIcon(systemName, specName),
        metaCalls: base64Encode(api.runtimeMetadata.asCallsOnly.toU8a()),
        specVersion: api.runtimeVersion.specVersion.toNumber(),
        ss58Format: isNumber(api.registry.chainSS58) ? api.registry.chainSS58 : DEFAULT_SS58.toNumber(),
        tokenDecimals: (api.registry.chainDecimals || [DEFAULT_DECIMALS.toNumber()])[0],
        tokenSymbol: (api.registry.chainTokens || formatBalance.getDefaults().unit)[0],
        types: getSpecTypes(api.registry, systemChain, api.runtimeVersion.specName, api.runtimeVersion.specVersion) as unknown as Record<string, string>
      }
      : null,
    [api, isApiReady, specName, systemChain, systemName, isEthereum]
  );
}
