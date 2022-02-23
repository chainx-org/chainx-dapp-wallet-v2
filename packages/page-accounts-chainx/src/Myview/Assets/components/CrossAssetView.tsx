import {SbtcAssetsInfo} from '@polkadot/react-hooks-chainx/types';
import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import Free from './Free';
import Frees from './Frees';
import {useTranslation} from '@polkadot/app-accounts/translate';
import BigNumber from 'bignumber.js';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import {useApi} from '@polkadot/react-hooks';
import CrossStaking from './CrossStaking';

export const AssetDetail = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  @media screen and (max-width: 1200px) {
    flex-direction: column;
  }
  div.infoViews {
    display: flex;
    align-items: baseline;
  }
  div.infoView {
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  div.infoview {
    @media screen and (max-width: 400px) {
        flex-wrap: wrap;
        button {
            margin-bottom: 10px;
        }
    }
  }
  div.AssetFee {
    display: flex;
    margin: 0 26px 8px 0;
    @media screen and (max-width: 600px) {
        width: 40%;
    }
  }
`;

export const AssetLine = styled.div`
  display: flex;
  & > div {
    display: flex;
    flex-direction: column;
  }
`;

type Props = {
  nodeName?: string,
  setNodeName?: React.Dispatch<string> | undefined,
  assetsInfo: SbtcAssetsInfo | undefined;
}

interface XbtcFreeInfo {
  balance: number,
  extra: null,
  isFrozen: boolean,
  sufficient: boolean,
  locked: number
}

export default function ({assetsInfo}: Props): React.ReactElement<Props> {
  const {isApiReady} = useApi();
  const {t} = useTranslation();
  const currentAccount = useContext(AccountContext);

  const [usable, setUsable] = useState<number>()
  const [reservedDexSpot, setReservedDexSpot] = useState<boolean>(false)
  const [reservedWithdrawal, setReservedWithdrawal] = useState<number>()
  const [allBalance, setAllBalance] = useState<number>()

  const defaultValue = JSON.parse(window.localStorage.getItem('sbtcInfo')) || {
    balance: 0,
    extra: null,
    isFrozen: false,
    sufficient: false,
    locked: 0
  }

  useEffect(() => {
    if(defaultValue){
      setUsable(new BigNumber(defaultValue.balance).toNumber())
      setReservedWithdrawal(new BigNumber(defaultValue.locked).toNumber())
      setReservedDexSpot(defaultValue.isFrozen)
      setAllBalance(defaultValue?.balance)
    } else{
      if(assetsInfo) {
        setUsable(new BigNumber(assetsInfo.balance).toNumber())
        setReservedWithdrawal(new BigNumber(assetsInfo.locked).toNumber())
        setReservedDexSpot(assetsInfo.isFrozen)
        setAllBalance(assetsInfo.balance)  
      }
    }
  }, [currentAccount, defaultValue, isApiReady, assetsInfo])

  const pcxAssets = [
    {
        assetName: 'Total Balance',
        assetFee: reservedWithdrawal,
        assetPrecision: 8
    },
    {
        assetName: 'Staking Frozen',
        assetFee: reservedWithdrawal,
        assetPrecision: 8
    },
    {
        assetName: 'Redeem Frozen',
        assetFee: reservedWithdrawal,
        assetPrecision: 8
    },
    {
        assetName: 'Staking Rewards',
        assetFee: reservedWithdrawal,
        assetPrecision: 8
    },
  ]
  return (
    <div>
      <AssetLine>
        <Frees
          asset='Transferrable Balance'
          free={reservedWithdrawal ? 0 : reservedWithdrawal}
          precision={8}
        />
      </AssetLine>
      <AssetDetail>
        <div className='infoViews infoView'>
        {
          pcxAssets.map((item)=>{
            return <AssetLine className='AssetFee' key={item.assetName}>
              <Free className='AssetFee'
                asset={t(`${item.assetName}`)}
                free={item.assetFee}
                precision={item.assetPrecision}
              />
            </AssetLine>
          })
        }
        </div>
        <div className='infoViews infoview'>
           <CrossStaking />
        </div>
      </AssetDetail>
    </div>
  );
}
