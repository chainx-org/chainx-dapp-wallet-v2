import {useApi} from '@polkadot/react-hooks';
import {useEffect, useState} from 'react';
import {AssetsInfo} from '@polkadot/react-hooks-chainx/types';
import {useLocalStorage} from '@polkadot/react-hooks-chainx';

interface XbtcAssetInfo {
  Locked: string;
  Reserved: string;
  ReservedDexSpot: string;
  ReservedWithdrawal: string;
  Usable: string;
  account: string;
  assetName: string;
  XbtcInterests: string;
}

function useXbtcAssets(account: string, n = 0): XbtcAssetInfo {
  const {api,isApiReady} = useApi();
  const [state, setState] = useState<XbtcAssetInfo>({
    Locked: '0',
    Reserved: '0',
    ReservedDexSpot: '0',
    ReservedWithdrawal: '0',
    Usable: '0',
    account: '0',
    assetName: '0',
    XbtcInterests: '0',
  });
  // const [, setValue] = useLocalStorage('xbtcInfo');

  useEffect((): void => {
    async function getAssets(account: string): Promise<any> {
      // const res = await api.rpc.xassets.getAssetsByAccount(account);
      let current = {
        Locked: '0',
        Reserved: '0',
        ReservedDexSpot: '0',
        ReservedWithdrawal: '0',
        Usable: '0'
      } as AssetsInfo;
      // const userAssets = JSON.parse(res);
      // Object.keys(userAssets).forEach((key: string) => {
      //   current = userAssets[key] as AssetsInfo;
      // });

      // const dividendRes = await api.rpc.xminingasset.getDividendByAccount(
      //   account
      // );
      let currentDividend: any = '0';
      // const userDividend = JSON.parse(dividendRes);

      // Object.keys(userDividend).forEach((key: string) => {
      //   currentDividend = userDividend[key];
      // });

      if (JSON.stringify(current) === '{}') {
        current = {
          Locked: '0',
          Reserved: '0',
          ReservedDexSpot: '0',
          ReservedWithdrawal: '0',
          Usable: '0'
        } as AssetsInfo;
      }

      current = Object.assign(current, {
        account: account,
        assetName: 'sBTC',
        XbtcInterests: currentDividend
      });
      // setValue(JSON.stringify(current));
      setState(current);
    }

    getAssets(account);
  }, [account, isApiReady, n]);

  return state;
}

export default useXbtcAssets;
