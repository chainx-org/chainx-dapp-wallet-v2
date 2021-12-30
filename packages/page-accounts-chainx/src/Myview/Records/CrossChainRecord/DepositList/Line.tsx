import React, { useContext, useRef, useState } from 'react';
import moment from 'moment';
import Detail from '../../components/Detail';
import Label from '../../components/Label';
import BtcTx from '../../components/BtcTx';
import BtcAddress from '../../components/BtcAddress';
import { useTranslation } from '@polkadot/app-accounts/translate';
import { toPrecision } from '@polkadot/app-accounts-chainx/Myview/toPrecision';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import useOutsideClick from '@polkadot/app-accounts-chainx/Myview/useOutsideClick';

interface Deposit {
  accountId: string,
  balance: string,
  blockNum: number,
  blockTimestamp: number,
  eventId: string,
  extrinsicHash: string,
  hashCode: string,
  moduleId: string,
}

export default function (props: { deposit: Deposit }): React.ReactElement {
  const { t } = useTranslation();
  const timeFormat = 'YYYY/MM/DD HH:mm:ss';
  const [outSideOpen, setOutSideOpen] = useState(false);
  const { currentAccount } = useContext(AccountContext);
  const wrapper = useRef(null);

  useOutsideClick(wrapper, () => {
    setOutSideOpen(false);
  });

  return (
    <li onClick={() => setOutSideOpen(!outSideOpen)}
      ref={wrapper}>
      <header>
        <span>sBTC</span>
        <span>{moment((props.deposit.blockTimestamp)*1000).format(timeFormat)}</span>
      </header>
      <main>
        <span>{toPrecision(props.deposit.balance, 8)}</span>
        {/* <span>{getState(props.deposit.txstate)}</span> */}
        <span>{props.deposit.blockNum}</span>
      </main>
      {outSideOpen ? (
        <Detail>
          <li>
            <Label>{t('Btc tx ID')}</Label>
            <BtcTx hash={props.deposit.extrinsicHash} />
          </li>
          <li>
            <Label>{t('Address')}</Label>
            <BtcAddress address={currentAccount} />
          </li>
        </Detail>
      ) : null
      }
    </li >
  );
}
