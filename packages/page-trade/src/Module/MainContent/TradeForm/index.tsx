import React, {useContext, useEffect, useState} from 'react';
import Wrapper from './Wrapper';
import Buy from './Buy';
import Sell from './Sell';
import {useAccounts, useApi} from '@polkadot/react-hooks';
import {AssetsInfo, TradingPairs} from '@polkadot/react-hooks-chainx/types';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import {DexContext} from '@polkadot/react-components-chainx/DexProvider';

export default function (): React.ReactElement {
  const hasAccounts = useAccounts();
  const {api,isApiReady} = useApi();
  const currentAccount = useContext(AccountContext);
  const [currentAccountInfo, setCurrentAccountInfo] = useState<AssetsInfo>();
  const [tradingPairsInfo, setTradingPairsInfo] = useState<TradingPairs>()
  const {isLoading} = useContext(DexContext);

  useEffect((): void => {
    async function getAssets(account: string): Promise<any> {
      // const res = await api.rpc.xassets.getAssetsByAccount(account);
      const res = await api.query.xAssets.assetBalance(account, 1)
      let current: AssetsInfo = {
        Usable: '0'
      } as AssetsInfo;
      const userAssets = JSON.parse(res);
      Object.keys(userAssets).forEach((key: string) => {
        current = userAssets as AssetsInfo;
      });
      if (JSON.stringify(current) === '{}') {
        current = {
          // Locked: '0',
          // Reserved: '0',
          // ReservedDexSpot: '0',
          // ReservedWithdrawal: '0',
          Usable: '0'
        } as AssetsInfo;
      }

      current = Object.assign(current, {
        account: account,
        assetName: 'X-BTC',
      });
      setCurrentAccountInfo(current);
    }
    isApiReady && getAssets(currentAccount.currentAccount);
  }, [currentAccount,isApiReady]);

  useEffect(() => {
    async function getTradingPairsInfo() {
      const res = await api.rpc.xspot.getTradingPairs();
      const tradingPairs = JSON.parse(res);
      let tradingPairsData = {} as TradingPairs;
      Object.keys(tradingPairs).forEach((key: string) => {
        tradingPairsData = tradingPairs[key];
      });
      setTradingPairsInfo(tradingPairsData)
    }

    getTradingPairsInfo();
  }, [isLoading]);

  return (
    <Wrapper>
      <Buy assetsInfo={hasAccounts ? currentAccountInfo : undefined} tradingPairsInfo={tradingPairsInfo}/>
      <Sell tradingPairsInfo={tradingPairsInfo}/>
    </Wrapper>
  );
}
