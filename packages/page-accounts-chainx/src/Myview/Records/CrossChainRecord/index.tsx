
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import DepositList from './DepositList';
import WithdrawalList from './WithdrawalList';
import { useTranslation } from '@polkadot/app-accounts/translate';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import useRecords from '@polkadot/app-accounts-chainx/useRecords';
import useWithdrawalsList from '../../../useWithdrawalsList';
import TransferList from './TransferList';
import useXsbtcTransfer from '../../../useXsbtcTransfer';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  & > header {
    // padding: 12px 16px;
    border-bottom: 1px solid #eee;
    margin-bottom: 0;

    ul {
      display: flex;
      justify-content: space-around;

      li {
        font-size: 13px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 18px;
        cursor: pointer;
        color: rgba(0,0,0,0.4);
        font-weight: 600;
        padding: 12px 0;
        &:not(:first-of-type) {
          margin-left: 24px;
        }

        &:hover, &.active{
          color: rgba(0,0,0,0.8);
        }

        &.active {
          border-bottom: 3px solid #ED2B89;
        }
      }
    }
  }

  & > main {
    flex: 1;
    overflow-y: auto;
  }
`;

export default function ({deposits}): React.ReactElement {
  const [option, setOption] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const { t } = useTranslation();
  const { currentAccount } = useContext(AccountContext);
  const WithdrawalsList = useWithdrawalsList(currentAccount);
  const XsbtcTransfer = useXsbtcTransfer(currentAccount)

  return (
    <Wrapper>
      <header>
        <ul>
          <li
            className={option === 'deposit' ? 'active' : ''}
            onClick={() => setOption('deposit')}
          >
            {t('Top Up')}
          </li>
          <li
            className={option === 'withdraw' ? 'active' : ''}
            onClick={() => setOption('withdraw')}
          >
            {t('Withdrawals')}
          </li>
          <li
            className={option === 'transfer' ? 'active' : ''}
            onClick={() => setOption('transfer')}
          >
            {t('Transfer')}
          </li>
          {/* <li */}
          {/*  onClick={() => setOption('lock')} */}
          {/*  className={option === 'lock' ? 'active' : ''} */}
          {/* > */}
          {/*  锁仓 */}
          {/* </li> */}
        </ul>
      </header>
      <main>
        {option === 'deposit' ? <DepositList deposits={deposits}/> : null}
        {option === 'withdraw' ? <WithdrawalList withdrawals={WithdrawalsList}/> : null}
        {option === 'transfer' ? <TransferList transfers={XsbtcTransfer}/> : null}
      </main>
    </Wrapper>
  );
}
