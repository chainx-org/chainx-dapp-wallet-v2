
import React, {useContext, useRef, useState} from 'react';
import Hash from './Hash';
import Address from './Address';
import Detail from '../components/Detail';
import Label from '../components/Label';
import { toPrecision } from '@polkadot/app-accounts-chainx/Myview/toPrecision';
import moment from 'moment';
import { useTranslation } from '@polkadot/react-components/translate';
import useOutsideClick from '@polkadot/app-accounts-chainx/Myview/useOutsideClick';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import {useApi} from '@polkadot/react-hooks';

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
        <span> PCX </span>
        <span>{moment.unix(transfer.blockTime).format('YYYY/MM/DD')}</span>
      </header>
      <main>
        <span>{toPrecision(transfer.balance, 8)}</span>
        <span>{transfer.to === currentAccount? t('In') : t('Out')}</span>
      </main>
      {isApiReady && api.rpc.system.properties() && open ? (
        <Detail>
          <li>
            <Label>{t('Tx ID')}</Label>
            <Hash hash={transfer['extrinsic_idx']} />
          </li>
          <li>
            <Label>{t('Address')}</Label>
            <Address address={transfer.to} />
          </li>
          {/* <li className="memo"> */}
          {/*  <Label>{}</Label> */}
          {/*  <p className="memo">{transfer.memo}</p> */}
          {/* </li> */}
        </Detail>
      ) : null}
    </div>
  );
}
