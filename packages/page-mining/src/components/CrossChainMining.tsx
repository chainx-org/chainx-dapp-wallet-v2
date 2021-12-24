import Header from './Header';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ChainStatus from './ChainStatus';
import { useTranslation } from '../translate';
import { useApi, useLoadingDelay, useAccounts } from '@polkadot/react-hooks';
import { useAccountAssets } from '@polkadot/react-hooks-chainx';
import { BN_ZERO, formatBalance, formatNumber } from '@polkadot/util';
import { Spinner } from '@polkadot/react-components';

const Content = styled.div`
  display: flex;
  align-items: flex-start;
  flex-grow: 1;
  margin: 0 28px;
  > .sBTC{
    background: rgba(255, 255, 255);
    display: flex;
    flex-direction: column;
    border: 1px solid rgb(220, 224, 226);
    border-bottom: 1px solid #ccc;
    justify-content: center;
    padding: 16px;
    border-radius: 10px;
    flex-grow: 1;
    > header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 3px 0px 16px;
      height: 30px;
      > .title{
        display: flex;
        > h6 {
          margin-left: 12px;
          font-weight: 600;
          opacity: 0.72;
          font-size: 16px;
          color: rgb(0, 0, 0);
          line-height: 24px;
        }
      }
      > .right{
        margin-right: 25px;
        > span{
          margin-right: 115px;
          > span:first-child{
              font-size: 12px;
              min-width: 200px;
              opacity: 0.32;
          }
          > span:last-child{
              opacity: 0.72 ;
              font-weight: 500;
              font-size: 16px;
          }
        }
      }
    }
    > div{
      display: flex;
      margin-top: 16px;
      > ul{
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        min-height: 40px;
        >li{
          display: flex;
          flex-direction: column;
          list-style: none;
          > span:first-child{
            opacity: 0.32;
            font-size: 12px;
            color: rgb(0, 0, 0);
            line-height: 16px;
          }
          > span: last-child{
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
              margin-top: 4px;
              opacity: 0.72;
              font-size: 14px;
              color: rgb(0, 0, 0);
              line-height: 20px;
          }
        }
      }
    }
  }
`;

const Hr = styled.hr`
  margin: 0px -16px;
  border: 0.5px solid rgb(238, 238, 238);
`;

export default function (): React.ReactElement {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const { allAssets, isFinished } = useAccountAssets(allAccounts);

  const userTotalAvailable = allAssets.reduce((pre, cur) => {
    return pre + Number(cur.Usable);
  }, 0);

  const userTotalInterest = allAssets.reduce((pre, cur) => {
    return pre + Number(cur.XbtcInterests);
  }, 0);

  const canwithDrawAccounts: string[] = [];

  allAssets.map((item) => {
    if (Number(item.XbtcInterests) > 0) {
      canwithDrawAccounts.push(item.account);
    }
  });

  const [miningDetail, setMiningDetail] = useState({
    balance: 0,
    miningPower: 0,
    votes: 0,
    totalPrizePool: 0,
    myBalance: 0
  });

  useEffect(() => {
    axios.get('https://api-v2.chainx.cc/crossblocks/deposit_mine')
      .then(function (response) {
        setMiningDetail({
          balance: response.data.items[0].balance.Usable / 100000000,
          miningPower: response.data.items[0].miningPower,
          votes: response.data.items[0].equivalent_nominations / 100000000,
          totalPrizePool: response.data.items[0].rewardPotBalance,
          myBalance: userTotalAvailable
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Content>
      {

        <div className='sBTC'>
          <Header accounts={canwithDrawAccounts}
            allAssets={allAssets}
            interestTotal={userTotalInterest} />
          <Hr />

          <div>
            <ul>
              <li><span>{t('Total chain balance')}</span> <span>{miningDetail.balance}</span></li>
              <li><span>{t('Mining calculation')}（KSX）</span> <span>{miningDetail.miningPower}</span></li>
              <li><span>{t('The number of votes')}（KSX）</span> <span>{miningDetail.votes}</span></li>
              <li><span>{t('Total prize pool')}（KSX）</span> <span>{Number(miningDetail.totalPrizePool) / Math.pow(10, 8)}</span></li>
              <li><span>{t('Total avalible xbtc balance')} XBTC</span>
                <span>{userTotalAvailable / Math.pow(10, 8)}</span></li>
            </ul>
          </div>
        </div>
      }
      <ChainStatus />
    </Content>
  );
}
