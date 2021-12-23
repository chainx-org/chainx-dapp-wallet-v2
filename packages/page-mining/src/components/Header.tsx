import XBTCLogo from '../xbtc.svg';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import React, { useContext, useState } from 'react';
import { useToggle } from '@polkadot/react-hooks';
import { useTranslation } from '@polkadot/apps/translate';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { AssetsInfo } from '@polkadot/react-hooks-chainx/types';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';

interface Props {
  accounts: string[],
  interestTotal: number,
  allAssets: AssetsInfo[]
}

export default function ({ accounts, allAssets, interestTotal }: Props): React.ReactElement {
  const [accountId, setAccountId] = useState<string | null | undefined>();
  const [isWithDraw, toggleWithDraw] = useToggle();
  const { t } = useTranslation();
  const options: KeyringSectionOption[] = [];
  const { currentAccount } = useContext(AccountContext);

  accounts.map((account) => {
    options.push(
      {
        key: account,
        name: account,
        value: account
      }
    );
  });

  return (
    <header>
      <div className='title'>
        <img alt=''
          src={XBTCLogo as string}
          width='30' />
        <h6>sBTC</h6>
      </div>
    </header>
  );
}
