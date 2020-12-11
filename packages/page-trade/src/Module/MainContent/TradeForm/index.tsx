
import React, {useContext, useEffect, useState} from 'react';
import Wrapper from './Wrapper';
import Buy from './Buy';
import Sell from './Sell';
import {useAccounts, useApi} from '@polkadot/react-hooks';
import {AssetsInfo} from '@polkadot/react-hooks-chainx/types';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';

export default function (): React.ReactElement {
  const hasAccounts = useAccounts()
  const api = useApi()
  const currentAccount = useContext(AccountContext);
  const [currentAccountInfo, setCurrentAccountInfo] = useState<AssetsInfo>();

  useEffect((): void => {
    async function getAssets(account: string): Promise<any> {
      const res = await api.api.rpc.xassets.getAssetsByAccount(account);
      let current: AssetsInfo = {
        Locked: "0",
        Reserved: "0",
        ReservedDexSpot: "0",
        ReservedWithdrawal: "0",
        Usable: "0"
      }as AssetsInfo;
      const userAssets = JSON.parse(res);
      Object.keys(userAssets).forEach((key: string) => {
        current = userAssets[key] as AssetsInfo;
      });
      if (JSON.stringify(current) === "{}") {
        current = {
          Locked: "0",
          Reserved: "0",
          ReservedDexSpot: "0",
          ReservedWithdrawal: "0",
          Usable: "0"
        } as AssetsInfo;
      }

      current = Object.assign(current, {
        account: account,
        assetName: "X-BTC",
      });
      setCurrentAccountInfo(current)

    }
    // getAssets('5TqDq71XesuCt8YFrXz2MqF1QqpJKYrg5LtCte3KWB7oyEBB')
    getAssets(currentAccount.currentAccount)
  }, [currentAccount])

  return (
    <Wrapper>
      <Buy assetsInfo={hasAccounts ?currentAccountInfo: undefined}/>
      <Sell/>
    </Wrapper>
  );
}
