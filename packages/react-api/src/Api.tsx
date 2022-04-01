// Copyright 2017-2020 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InjectedExtension } from '@polkadot/extension-inject/types';
import type { KeyringStore } from '@polkadot/ui-keyring/types';
import type { ChainProperties, ChainType } from '@polkadot/types/interfaces';
import type { ApiProps, ApiState } from './types';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import store from 'store';
import { ApiPromise } from '@polkadot/api/promise';
import { setDeriveCache, deriveMapCache } from '@polkadot/api-derive/util';
import { ethereumNetworks, typesChain, typesBundle } from '@polkadot/apps-config';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { WsProvider } from '@polkadot/rpc-provider';
import { StatusContext } from '@polkadot/react-components/Status';
import { TokenUnit } from '@polkadot/react-components/InputNumber';
import ApiSigner from '@polkadot/react-signer/signers/ApiSigner';
import keyring from '@polkadot/ui-keyring';
import { settings } from '@polkadot/ui-settings';
import { formatBalance, isTestChain, objectSpread } from '@polkadot/util';
import { setSS58Format } from '@polkadot/util-crypto';
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults';
import { options } from '@chainx-v2/api'
import { decodeUrlTypes } from './urlTypes';

import ApiContext from './ApiContext';
import registry from './typeRegistry';
import {rpcFile} from './chainxRpc'
import {typeFile} from './chainxTypes'

interface Props {
  children: React.ReactNode;
  url?: string;
  store?: KeyringStore;
}

interface InjectedAccountExt {
  address: string;
  meta: {
    name: string;
    source: string;
    whenCreated: number;
  };
}

interface ChainData {
  injectedAccounts: InjectedAccountExt[];
  properties: ChainProperties;
  systemChain: string;
  systemChainType: ChainType;
  systemName: string;
  systemVersion: string;
}

export const DEFAULT_DECIMALS = registry.createType('u32', 12);
export const DEFAULT_SS58 = registry.createType('u32', addressDefaults.prefix);
export const DEFAULT_AUX = ['Aux1', 'Aux2', 'Aux3', 'Aux4', 'Aux5', 'Aux6', 'Aux7', 'Aux8', 'Aux9'];

let api: ApiPromise;

export { api };

function isKeyringLoaded() {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

function getDevTypes(): Record<string, Record<string, string>> {
  const types = decodeUrlTypes() || store.get('types', {}) as Record<string, Record<string, string>>;
  const names = Object.keys(types);

  names.length && console.log('Injected types:', names.join(', '));

  return types;
}

async function getInjectedAccounts (injectedPromise: Promise<InjectedExtension[]>): Promise<InjectedAccountExt[]> {
  try {
    await injectedPromise;

    const accounts = await web3Accounts();

    return accounts.map(({ address, meta }, whenCreated): InjectedAccountExt => ({
      address,
      meta: objectSpread({}, meta, {
        name: `${meta.name || 'unknown'} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`,
        whenCreated
      })
    }));
  } catch (error) {
    console.error('web3Accounts', error);

    return [];
  }
}

async function retrieve(api: ApiPromise, injectedPromise: Promise<InjectedExtension[]>): Promise<ChainData> {
  const [systemChain, systemChainType, systemName, systemVersion, injectedAccounts] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
    api.rpc.system.name(),
    api.rpc.system.version(),
    getInjectedAccounts(injectedPromise)
  ]);

  return {
    injectedAccounts,
    properties: registry.createType('ChainProperties', {
      ss58Format: api.registry.chainSS58,
      tokenDecimals: api.registry.chainDecimals,
      tokenSymbol: api.registry.chainTokens
    }),
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString()
  };
}

async function loadOnReady(api: ApiPromise, injectedPromise: Promise<InjectedExtension[]>, store: KeyringStore | undefined, types: Record<string, Record<string, string>>): Promise<ApiState> {
  registry.register(types);

  const { injectedAccounts, properties, systemChain, systemChainType, systemName, systemVersion } = await retrieve(api, injectedPromise);
  const ss58Format = settings.prefix === -1
    ? properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber()
    : settings.prefix;
  const tokenSymbol = properties.tokenSymbol.unwrapOr([formatBalance.getDefaults().unit, ...DEFAULT_AUX]);
  const tokenDecimals = properties.tokenDecimals.unwrapOr([DEFAULT_DECIMALS]);
  const isEthereum = ethereumNetworks.includes(api.runtimeVersion.specName.toString());
  const isDevelopment = !isEthereum && (systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain));

  console.log(`chain: ${systemChain} (${systemChainType.toString()}), ${JSON.stringify(properties)}`);

  // explicitly override the ss58Format as specified
  registry.setChainProperties(registry.createType('ChainProperties', { ss58Format, tokenDecimals, tokenSymbol }));

  // FIXME This should be removed (however we have some hanging bits, e.g. vanity)
  setSS58Format(ss58Format);

  // first setup the UI helpers
  formatBalance.setDefaults({
    decimals: tokenDecimals.map((b) => b.toNumber()),
    unit: tokenSymbol[0].toString()
  });
  TokenUnit.setAbbr(tokenSymbol[0].toString());

  // finally load the keyring
  isKeyringLoaded() || keyring.loadAll({
    genesisHash: api.genesisHash,
    isDevelopment,
    ss58Format,
    store,
    type: isEthereum ? 'ethereum' : 'ed25519'
  }, injectedAccounts);

  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];
  const apiDefaultTx = api.tx[defaultSection][defaultMethod];
  const apiDefaultTxSudo = (api.tx.system && api.tx.system.setCode) || apiDefaultTx;
  const isSubstrateV2 = !!Object.keys(api.consts).length;

  setDeriveCache(api.genesisHash.toHex(), deriveMapCache);

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    hasInjectedAccounts: injectedAccounts.length !== 0,
    isApiReady: true,
    isDevelopment: isEthereum ? false : isDevelopment,
    isEthereum,
    isSubstrateV2,
    systemChain,
    systemName,
    systemVersion
  };
}

function Api({ children, store, url }: Props): React.ReactElement<Props> | null {
  const { queuePayload, queueSetTxStatus } = useContext(StatusContext);
  const [state, setState] = useState<ApiState>({ hasInjectedAccounts: false, isApiReady: false } as unknown as ApiState);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [apiError, setApiError] = useState<null | string>(null);
  const [extensions, setExtensions] = useState<InjectedExtension[] | undefined>();

  const value = useMemo<ApiProps>(
    () => ({ ...state, api, apiError, extensions, isApiConnected, isApiInitialized, isWaitingInjected: !extensions }),
    [apiError, extensions, isApiConnected, isApiInitialized, state]
  );

  // initial initialization
  useEffect((): void => {
    const provider = new WsProvider(url);
    const signer = new ApiSigner(queuePayload, queueSetTxStatus);
    const types = getDevTypes();

    api = new ApiPromise({rpc: rpcFile, types: typeFile, provider: provider});
    api.on('connected', () => setIsApiConnected(true));
    api.on('disconnected', () => setIsApiConnected(false));
    api.on('error', (error: Error) => setApiError(error.message));
    api.on('ready', (): void => {
      const injectedPromise = web3Enable('polkadot-js/apps');

      injectedPromise
        .then(setExtensions)
        .catch(console.error);

      loadOnReady(api, injectedPromise, store, types)
        .then(setState)
        .catch((error): void => {
          console.error(error);

          setApiError((error as Error).message);
        });
    });

    setIsApiInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, queuePayload, queueSetTxStatus, store]);

  if (!value.isApiInitialized) {
    return null;
  }

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export default React.memo(Api);
