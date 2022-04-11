import React, {useContext, useState} from 'react';

import Card from './Card';
import styled from 'styled-components';
import AssetView from './AssetView';
import Logo from './Logo';
import AccountInfo from './AccountInfo';
import backgroundImg from './background.svg';
import {useAccounts, useApi, useToggle} from '@polkadot/react-hooks';
import Transfer from '@polkadot/app-accounts-chainx/modals/Transfer';
import {useTranslation} from '@polkadot/app-accounts-chainx/translate';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import {ActionStatus} from '@polkadot/react-components/Status/types';
import Button from '@polkadot/react-components-chainx/Button';
import {usePcxBalance} from '../usePcxBalance'

const InnerWrapper = styled.div`
  position: relative;
  opacity: 0.8;
  background-image: linear-gradient(90deg, #ffe981 0%, #f6ca4a 100%);
  border-radius: 10px;
  padding: 16px;
  min-height: 222px;

  header {
    display: flex;
    justify-content: space-between;
    @media screen and (max-width:540px){
      flex-direction: column;
      align-items: baseline;
    }
  }

  section.free {
    display: flex;
    margin-top: 10px;
    align-items: flex-end;
    @media screen and (min-width:375px) and (max-width:540px){
      position: relative;
    }
    @media screen and (max-width:374px){
      flex-direction: column;
      align-items: baseline;
    }
  }
  .whiteBtn {
    color: rgba(0, 0, 0, 0.72);
    border: 1px solid rgba(0,0,0,0.04);
    padding: 1px 2em;
    font-size: 0.875rem;
    min-width: 64px;
    box-sizing: border-box;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    font-family: Cairo, Arial, sans-serif;
    font-weight: 500;
    line-height: 1.75;
    border-radius: 14px;
    text-transform: none;
    margin: 0 0 4px 32px;
    @media screen and (max-width:374px){
      margin: 6px 0 0;
    }
    &:hover {
      background: #E8E9EA !important;
      color: rgba(0, 0, 0, 0.72) !important;
      box-shadow: none;
    }
    @media screen and (min-width:375px) and (max-width:540px){
      position: absolute;
      top: -4px;
      right: 0;
    }
  }
  section.details {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-top: 32px;
    & > div:not(:last-of-type) {
      margin-right: 66px;
    }
    @media screen and (min-width:375px) and (max-width:540px){
      display: grid;
      grid-template-columns: 1fr 1fr;
      & > div:not(:last-of-type) {
        margin-right: 20px;
      }
    }
    @media screen and (max-width:374px){
      display: grid;
      grid-template-columns: 1fr 1fr;
      & > div:not(:last-of-type) {
        margin-right: 10px;
      }
    }
  }
`;

const CornerBackground = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  background-image: url(${backgroundImg});
  width: 179px;
  height: 147px;
  opacity: 0.2;
  @media screen and (max-width:767px) {
    display: none;
  }
`;

interface PcxCardProps {
  onStatusChange: (status: ActionStatus) => void;
}

export default function ({onStatusChange}: PcxCardProps): React.ReactElement<PcxCardProps> {
  const {api, isApiReady} = useApi();
  const {t} = useTranslation();
  const {hasAccounts, allAccounts} = useAccounts()
  const [isTransferOpen, toggleTransfer] = useToggle();
  const [n, setN] = useState(0);
  const {currentAccount} = useContext(AccountContext);
  const hasCurrentName = allAccounts.find(account => account === currentAccount)
  const {usableBalanceNum, totalBalanceNum, unBoundFrozenNum, votingFrozenNum} = usePcxBalance(currentAccount, n)

  return (
    <Card>
      <InnerWrapper>
        <header>
          <Logo/>
          {/* {isApiReady? <AccountInfo/>: <div>{currentAccount}</div>} */}
          {isApiReady? <AccountInfo/>: ''}
        </header>
        <section className='free' key='free'>
          <AssetView
            bold
            title={t('Free Balance')}
            value={usableBalanceNum}
          />
          {isApiReady && api.tx.balances?.transfer && currentAccount && (
            <Button
              className="whiteBtn"
              onClick={toggleTransfer}
              isBasic={true}
              isDisabled={!isApiReady || !currentAccount || !hasAccounts || !hasCurrentName}
            >
              {t('Transfer')}
            </Button>
          )}
        </section>
        <section className='details' key="details">
          {(
            <>
              <AssetView
                key={'Total Balance'}
                title={t('Total Balance')}
                value={totalBalanceNum}
              />
              <AssetView
                key={'Voting Frozen'}
                title={t('Voting Frozen')}
                value={votingFrozenNum}
                help={t('The number of Voting Frozen is the largest number of votes which are locked in Staking、Referendum or Voting for Council')}
              />
              <AssetView
                key={'UnBound Frozen'}
                title={t('UnBound Frozen')}
                value={unBoundFrozenNum}
              />
              {/*<AssetView*/}
              {/*  key={Math.random()}*/}
              {/*  title={t('Other Frozen')}*/}
              {/*  value={reserved}*/}
              {/*  help={t('The Other Frozen mainly include pledge freeze, DEX freeze, council election freeze, submit proposal freeze, seconding freeze and so on')}*/}
              {/*/>*/}
            </>
          )}
        </section>
        <CornerBackground/>
        {isTransferOpen && (
          <Transfer
            key='modal-transfer'
            onClose={toggleTransfer}
            senderId={currentAccount}
            onStatusChange={onStatusChange}
            setN={setN}
          />
        )}
      </InnerWrapper>
    </Card>
  );
}
