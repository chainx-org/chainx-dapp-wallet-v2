import {SbtcAssetsInfo} from '@polkadot/react-hooks-chainx/types';
import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import Free from './Free';
import Frees from './Frees';
import InfoView from './InfoView';
import {useTranslation} from '@polkadot/app-accounts/translate';
import BN from 'bn.js';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import {useApi} from '@polkadot/react-hooks';
import {isPaste} from '@polkadot/react-components/Input';


export const AssetDetail = styled.div`
  display: flex;
  margin-top: 14px;
  div.infoView {
    width: 16%;
    @media screen and (max-width:767px) {
      width: 30%;
    }
  }
  div.infoViews {
    width: 50%;
  }
  div {
    display: flex;
    flex-direction: row;
    margin-right: 26px;
    div {
      margin-bottom: 10px;
      width: 80%;
    }
  }
  @media screen and (max-width:767px) {
    div {
      flex-direction: column;
      margin-right: 0px;
      width: 100%;
      div {
        width: 100%;
      }
    }
  }
  @media screen and (min-width:767px) and (max-width:980px) {
    div {
      flex-direction: column;
      width: 100%;
      div {
        width: 100%;
      }
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

  const [usable, setUsable] = useState<number>(0)
  const [reservedDexSpot, setReservedDexSpot] = useState<boolean>(false)
  const [reservedWithdrawal, setReservedWithdrawal] = useState<number>(0)
  const [allBalance, setAllBalance] = useState<number>(0)

  const defaultValue = JSON.parse(window.localStorage.getItem('sbtcInfo')) || {
    balance: 0,
    extra: null,
    isFrozen: false,
    sufficient: false,
    locked: 0
  }

  const [defaultXbtc, setDefaultXbtc] = useState<SbtcAssetsInfo>(defaultValue)

  const [defaultXbtcValue, setDefaultXbtcValue] = useState<XbtcFreeInfo>({
    balance: defaultValue.balance,
    extra: defaultValue.extra,
    isFrozen: defaultValue.isFrozen,
    sufficient: defaultValue.sufficient,
    locked: defaultValue.locked
  });

  useEffect(() => {
    setDefaultXbtc(defaultValue);
    if (defaultXbtc) {
      setDefaultXbtcValue({
        balance: defaultXbtc.balance,
        extra: defaultXbtc.extra,
        isFrozen: defaultXbtc.isFrozen,
        sufficient: defaultXbtc.sufficient,
        locked: defaultValue.locked
      });
    }

  }, [currentAccount, isApiReady, assetsInfo]);

  useEffect(() => {
    if(isApiReady && assetsInfo){
      setUsable((new BN(assetsInfo.balance)).toNumber())
      setReservedDexSpot(assetsInfo.isFrozen)
      setReservedWithdrawal(assetsInfo.locked)
      setAllBalance(assetsInfo.balance)
    }else{
      setUsable((new BN(defaultXbtcValue.balance)).toNumber())
      setReservedDexSpot(defaultXbtcValue.isFrozen)
      setReservedWithdrawal(defaultXbtcValue.locked)
      setAllBalance(assetsInfo?.balance)
    }
  }, [defaultValue, isApiReady, assetsInfo])

  return (
    <div>
      <AssetLine>
        <Frees
          asset='Balance'
          free={reservedDexSpot ? usable : 0}
          precision={8}
        />
      </AssetLine>
      <AssetDetail>
        <div className='infoView'>
          <AssetLine>
            <InfoView info='Bitcoin'
                      title={t('Chain')}/>
          </AssetLine>
          {/* <AssetLine>
            <Free
              asset={t('DEX Reserved')}
              free={reservedDexSpot}
              precision={8}
            />
          </AssetLine> */}
        </div>
        <div className='infoViews'>
          <AssetLine>
            <Free
              asset={t('Withdrawal Reserved')}
              free={reservedWithdrawal}
              precision={8}
            />
          </AssetLine>
          <AssetLine>
            <Free
              asset={t('Total Balance')}
              free={allBalance}
              precision={8}
            />
          </AssetLine>
        </div>
      </AssetDetail>
    </div>
  );
}
