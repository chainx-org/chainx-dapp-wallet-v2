import React, {ReactNode, useContext, useEffect, useState} from 'react';
import Card from './CardWrapper';
import Logo from './Logo';
import styled from 'styled-components';
import {useTranslation} from '@polkadot/app-accounts/translate';
import {useApi} from '@polkadot/react-hooks';
import FooterWithdrawal from '@polkadot/app-accounts-chainx/Myview/Assets/components/FooterWithdrawal';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import {toPrecision} from '@polkadot/app-accounts-chainx/Myview/toPrecision';
import BigNumber from 'bignumber.js';

const Hr = styled.hr`
  margin: 0;
`;
const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width:540px){
    flex-direction: column;
    align-items: baseline;
  }
  .btnLists {
    color: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(0,0,0,0.04);
    padding: 1px 1.5em;
    white-space: nowrap;
    @media screen and (max-width:375px){
      padding: 1px 1em;
    }
    font-size: 0.875rem;
    min-width: 64px;
    box-sizing: border-box;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    font-family: Cairo, Arial, sans-serif;
    font-weight: 500;
    line-height: 1.75;
    border-radius: 14px;
    text-transform: none;
    margin-right: 8px;
  }
  .primaryBtn {
    background-color: #FFA1DB;
    &:hover {
      background-color: #ED2B89 !important;
      color: rgba(0, 0, 0, 0.7) !important;
      box-shadow: none;
    }
  }
  .defaultBtn {
    background-color: #F2F3F4;
    &:hover {
      background-color: #E8E9EA !important;
      color: rgba(0, 0, 0, 0.7) !important;
      box-shadow: none;
    }
  }
`;
const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  > div:first-child{
    display: flex;
    align-items: center;
    @media screen and (max-width:540px){
      flex-direction: column;
      align-items: baseline;
    }
    > span:last-child{
      margin-left: 16px;
      font-size: 20px;
      font-weight: bold;
      @media screen and (max-width:540px){
        margin: 6px 0 0 0;
      }
    }
  }
`;

export default function (props: { children?: ReactNode, buttonGroup?: ReactNode, logo?: any, footer?: ReactNode }) {
  const {logo} = props;
  const {t} = useTranslation();
  const {api} = useApi();
  const [allInterests, setAllInterests] = useState<number>();
  const [usableInterests, setUsableInterests] = useState<number>();
  const [insufficientStake, setInsufficientStake] = useState<number>()
  const {currentAccount} = useContext(AccountContext);
  const [n, setN] = useState<number>(0);
  useEffect((): void => {
    async function getDividend(account: string) {
      const dividendRes = await api.rpc.xminingasset.getDividendByAccount(account);
      let currentDividend: any = '';
      const userDividend = JSON.parse(dividendRes);
      Object.keys(userDividend).forEach((key: string) => {
        currentDividend = userDividend[key];
      });
      const bgOwnInterests = new BigNumber(toPrecision(currentDividend.own, 8));
      const bgOtherInterests = new BigNumber(toPrecision(currentDividend.other, 8));
      const bgInsufficientStake = new BigNumber(toPrecision(currentDividend.insufficientStake, 8))
      const bgAllInterests = bgOwnInterests.toNumber() + bgOtherInterests.toNumber();

      setAllInterests(+bgAllInterests.toFixed(8));
      setUsableInterests(+bgOwnInterests.toNumber().toFixed(8));
      setInsufficientStake(+bgInsufficientStake.toNumber().toFixed(8))
    }

    // getDividend('5TqDq71XesuCt8YFrXz2MqF1QqpJKYrg5LtCte3KWB7oyEBB');
    getDividend(currentAccount);
  }, [currentAccount, n]);

  return (
    <Card>
      <header>
        <p>{t('Cross-chain assets')}</p>
        <hr/>
      </header>
      <HeadWrapper>
        <Logo logo={logo}
              name='X-BTC'
              tokenName='Interchain BTC'/>
        {props.buttonGroup}
      </HeadWrapper>
      {props.children}
      <Hr/>
      <Footer>
        <div>
          <span style={{
            whiteSpace: "nowrap"
          }}>{t('Mining Interest')}</span>
          <span style={{
            whiteSpace: "nowrap"
          }}>  {usableInterests ? usableInterests.toFixed(8) : 0} KSX</span>
        </div>
        <div>
          <FooterWithdrawal allInterests={allInterests} usableInterests={usableInterests} insufficientStake={insufficientStake} setN={setN}/>
        </div>
      </Footer>
    </Card>
  );
}
