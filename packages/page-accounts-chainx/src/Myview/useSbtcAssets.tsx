import {useApi} from '@polkadot/react-hooks';
import {useEffect, useState} from 'react';
import {useLocalStorage} from '@polkadot/react-hooks-chainx';

export interface SbtcAssetsInfo {
    balance: number,
    extra: null,
    isFrozen: boolean,
    sufficient: boolean,
    locked: number
}

function useSbtcAssets(account: string, n = 0): SbtcAssetsInfo {
  const {api,isApiReady} = useApi();
  const [state, setState] = useState<SbtcAssetsInfo>({
    balance: 0,
    extra: null,
    isFrozen: false,
    sufficient: false,
    locked: 0
  });
  const [, setValue] = useLocalStorage('sbtcInfo');

  useEffect((): void => {
    async function getAssets(account: string): Promise<any> {
      if(isApiReady) {
        const asset = await api.query.assets.account(1, account)
        const assetLock = await api.query.xGatewayRecords.locks(account, 1)
        // setValue(asset)
        let current = {
          balance: 0,
          extra: null,
          isFrozen: false,
          sufficient: false,
          locked: 0
        } as SbtcAssetsInfo;
        current = Object.assign(asset, {
          account: account,
          assetName: 'sBTC',
          locked: assetLock
        });
        setValue(JSON.stringify(current));
        setState(current);
      }

      // if (JSON.stringify(current) === '{}') {
      //   current = {
      //     balance: 0,
      //     extra: null,
      //     isFrozen: false,
      //     sufficient: false,
      //   } as SbtcAssetsInfo;
      // }
    }
    getAssets(account);
  }, [account, isApiReady, n]);

  return state;
}

export default useSbtcAssets;
