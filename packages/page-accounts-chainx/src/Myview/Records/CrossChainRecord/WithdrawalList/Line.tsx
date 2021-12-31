
import React, { useRef, useState } from 'react';
import moment from 'moment';
import Detail from '../../components/Detail';
import Label from '../../components/Label';
import { useTranslation } from '@polkadot/app-accounts/translate';
import { toPrecision } from '@polkadot/app-accounts-chainx/Myview/toPrecision';
import useOutsideClick from '@polkadot/app-accounts-chainx/Myview/useOutsideClick';
import Status from './State'
import XsbtcLinkScan from '../../components/XsbtcLinkScan';
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
            <XsbtcLinkScan linkTo={props.withdrawal.extrinsicHash} status={'trade'} />
          </li>
          <li>
            <Label>{t('Applicant')}</Label>
            <XsbtcLinkScan linkTo={props.withdrawal.applicant} status={'account'}/>
          </li>
          <li>
            <Label>{t('Address')}</Label>
            <XsbtcLinkScan linkTo={props.withdrawal.addr} status={'account'}/>
          </li>
          <li>
            <Label>{t('BlockHeight')}</Label>
            <XsbtcLinkScan linkTo={props.withdrawal.blockNum} status={'blockDetails'}/>
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
