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
  const [lock, setLock] = useState()
  const [state, setState] = useState<SbtcAssetsInfo>({
    balance: 0,
    extra: null,
    isFrozen: false,
    sufficient: false,
    locked: null
  });
  const [, setValue] = useLocalStorage('sbtcInfo');

  useEffect((): void => {
    async function getAssets(account: string): Promise<any> {
        if(isApiReady) {
            const asset = await api.query.assets.account(1, account)
            const assetLock = await api.query.xGatewayRecords.locks(account, 1)
            setValue(asset)
            setLock(assetLock)
        }
      let current = {
        balance: 0,
        extra: null,
        isFrozen: false,
        sufficient: false,
      } as SbtcAssetsInfo;

      if (JSON.stringify(current) === '{}') {
        current = {
            balance: 0,
            extra: null,
            isFrozen: false,
            sufficient: false,
        } as SbtcAssetsInfo;
      }
      
      current = Object.assign(current, {
        account: account,
        assetName: 'sBTC',
        locked: lock || 0
      });
      setValue(JSON.stringify(current));
      setState(current);
    }

    getAssets(account);
  }, [account, isApiReady, n]);

  return state;
}

export default useSbtcAssets;
