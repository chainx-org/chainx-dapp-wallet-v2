import {useApi} from '@polkadot/react-hooks';
import {useEffect, useState} from 'react';
import {useLocalStorage} from '@polkadot/react-hooks-chainx';

export interface SbtcAssetsInfo {
    balance: number,
    extra: null,
    isFrozen: boolean,
    sufficient: boolean,
    // locked: number
}

function usePCXAssets(account: string, n = 0): SbtcAssetsInfo {
  const {api,isApiReady} = useApi();
  const [state, setState] = useState<SbtcAssetsInfo>({
    balance: 0,
    extra: null,
    isFrozen: false,
    sufficient: false,
    // locked: 0
  });
  const [, setValue] = useLocalStorage('pcxInfo');

  useEffect((): void => {
    async function getAssets(account: string): Promise<any> {
      if(isApiReady) {
        if(api.query.assets) {
          const asset = await api.query.assets.account(2, account)
        //   const assetLock = await api.query.xGatewayRecords.locks(account, 2)
        //   console.log('x-pcx',asset.toJSON())
          // setValue(asset)
          let current = {
            balance: asset.balance,
            extra: asset.extra,
            isFrozen: asset.isFrozen,
            sufficient: asset.sufficient,
            // locked: assetLock.toJSON() !== null ? assetLock.toJSON() : 0
          } as SbtcAssetsInfo;
          current = Object.assign(current, {
            account: account,
            assetName: 'pcx',
            // locked: assetLock.toJSON() !== null ? assetLock.toJSON() : 0
          });
          setValue(JSON.stringify(current));
          setState(current);
        } else {
          let curr = {
            balance: 0,
            extra: null,
            isFrozen: false,
            sufficient: false,
            // locked: 0
          }
          curr = Object.assign(curr, {
            account: account,
            assetName: 'pcx',
          });
          setValue(JSON.stringify(curr));
          setState(curr);
        }
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

export default usePCXAssets;