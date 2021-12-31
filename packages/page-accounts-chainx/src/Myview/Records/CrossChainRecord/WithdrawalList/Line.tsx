
import React, { useContext, useRef, useState } from 'react';
import moment from 'moment';
import Detail from '../../components/Detail';
import Label from '../../components/Label';
import BtcAddress from '../../components/BtcAddress';
import { useTranslation } from '@polkadot/app-accounts/translate';
import BtcTx from '../../components/BtcTx';
import { toPrecision } from '@polkadot/app-accounts-chainx/Myview/toPrecision';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import useOutsideClick from '@polkadot/app-accounts-chainx/Myview/useOutsideClick';
import Status from './State'
import BtcBlockHeight from '../../components/BtcBlockHeight';
interface Withdraw {
  addr: string,
  applicant: string,
  assetId: number
  balance: string
  blockNum: number
  blockTimestamp: number
  eventId: string
  ext: string
  extrinsicHash: string
  moduleId: string
  withdrawStatus: string
  withdrawalId: number
}

export default function (props: { withdrawal: Withdraw }): React.ReactElement {
  const { t } = useTranslation();
  const wrapper = useRef(null);
  const timeFormat = 'YYYY/MM/DD HH:mm:ss';
  const [outSideOpen, setOutSideOpen] = useState(false);
  useOutsideClick(wrapper, () => {
    setOutSideOpen(false);
  });

  return (
    <li onClick={() => setOutSideOpen(!outSideOpen)}
      ref={wrapper}>
      <header>
        <span>sBTC</span>
        <span>{moment((props.withdrawal.blockTimestamp)*1000).format(timeFormat)}</span>
      </header>
      <main>
        <span className='text'>
          {toPrecision((props.withdrawal.balance), 8)}
        </span>
        <span className='text'>
          {Status(props.withdrawal.withdrawStatus)}
        </span>
      </main>
      {outSideOpen ? (
        <Detail>
          <li>
            <Label>{t('Trading ID')}</Label>
            <BtcTx hash={props.withdrawal.extrinsicHash} />
          </li>
          <li>
            <Label>{t('Applicant')}</Label>
            <BtcAddress address={props.withdrawal.applicant} />
          </li>
          <li>
            <Label>{t('Address')}</Label>
            <BtcAddress address={props.withdrawal.addr} />
          </li>
          <li>
            <Label>{t('BlockHeight')}</Label>
            <BtcBlockHeight blockHeight={props.withdrawal.blockNum} />
          </li>
          <li>
            <Label>{t('Remark')}</Label>
            <p className='memo'>{props.withdrawal.ext}</p>
          </li>
        </Detail>
      ) : null}
    </li>
  );
}
