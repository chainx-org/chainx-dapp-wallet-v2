// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import typesChain from './chain';
// import typesSpec from './spec';
import type { OverrideBundleType } from '@polkadot/types/types';
import spec from './spec';

// export { default as typesBundle } from './bundle';
export * from './constants';
export { default as typesRpc } from './rpc';

export function getChainTypes (_specName: string, chainName: string): Record<string, string | Record<string, unknown>> {
  // return {
  //   ...(typesSpec[specName as 'edgeware'] || {}),
  //   ...(typesChain[chainName as 'Beresheet'] || {})
  // };
  return {
    ...(typesChain[chainName as keyof typeof typesChain] || {})
  };
}
// export {
//   typesChain,
//   typesSpec
// };
export const typesBundle: OverrideBundleType = { spec };

export { typesChain };
