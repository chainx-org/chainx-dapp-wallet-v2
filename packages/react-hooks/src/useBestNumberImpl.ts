import type { BlockNumber } from '@polkadot/types/interfaces';

import { useApi } from './useApi';
import { useCall } from './useCall';

function useBestNumberImpl (): BlockNumber | undefined {
  const { api } = useApi();

  return useCall<BlockNumber>(api.derive.chain.bestNumber);
}

export { useBestNumberImpl }
