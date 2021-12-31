
import React, {useContext, useRef, useState} from 'react';
import Detail from '../../components/Detail';
import Label from '../../components/Label';
import { toPrecision } from '@polkadot/app-accounts-chainx/Myview/toPrecision';
import moment from 'moment';
import { useTranslation } from '@polkadot/react-components/translate';
import useOutsideClick from '@polkadot/app-accounts-chainx/Myview/useOutsideClick';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import {useApi} from '@polkadot/react-hooks';
import BigNumber from 'bignumber.js'
import XsbtcLinkScan from '../../components/XsbtcLinkScan';

export default function ({ transfer }: any) {
  const { t } = useTranslation();
  const {api, isApiReady} = useApi()
  const [open, setOpen] = useState(false);
  const { currentAccount } = useContext(AccountContext);
  const wrapper = useRef(null);

  useOutsideClick(wrapper, () => {
    setOpen(false);
  });

  return (
    <div className='line'
      onClick={() => setOpen(!open)}
      ref={wrapper}>
      <header>
        <span> sBTC </span>
        <span>{moment(new Date((transfer.blockTimestamp)*1000)).format('YYYY/MM/DD HH:mm:ss')}</span>
      </header>
      <main>
        {/* <span>{new BigNumber(toPrecision(transfer.balance, 18)).toNumber().toFixed(4)}</span> */}
        <span>{Number(new BigNumber(toPrecision(transfer.balance, 8)).toNumber().toFixed(4))}</span>
        <span>{transfer.fromAccountId === currentAccount? t('Out') : t('In')}</span>
      </main>
      {isApiReady && api.rpc.system.properties() && open ? (
        <Detail>
          <li>
            <Label>{t('Tx ID')}</Label>
            <XsbtcLinkScan linkTo={transfer.extrinsicHash} status='trade' />
          </li>
          <li>
            <Label>{t('Address')}</Label>
            <XsbtcLinkScan linkTo={transfer.toAccountId} status='account' />
          </li>
          <li className="memo">
           <Label>{t('BlockHeight')}</Label>
           <XsbtcLinkScan linkTo={transfer.blockNum} status={'blockDetails'}/>
          </li>
        </Detail>
      ) : null}
    </div>
  );
}
