import React, {useContext, useEffect, useState} from 'react';
import xbtcLogo from './xbtc.svg';
import sbtcLogo from './icon_SBTC.svg'
import AssetCard from '../components/AssetCard';
import AssetView from '../components/AssetView';
import {AssetLine, DetailWrapper} from '../components/common';
// import { PrimaryButton, DefaultButton } from '@chainx/ui';
import Transfer from '../../../modals/XBTCTransfer';
import {useAccounts, useApi, useToggle} from '@polkadot/react-hooks';
import {AssetsInfo} from '@polkadot/react-hooks-chainx/types';
// import Deposite from '../../../modals/deposite';
import Deposite from '../../../modals/deposite/deposite';
import Withdraw from '../../../modals/withdraw';
import {useTranslation} from '@polkadot/app-accounts/translate';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import Button from '@polkadot/react-components-chainx/Button';
import useSbtcAssets from '@polkadot/app-accounts-chainx/Myview/useSbtcAssets';


export default function (): React.ReactElement {
  const {isApiReady} = useApi();
  const {t} = useTranslation();
  const {currentAccount} = useContext(AccountContext);
  const [isTransferOpen, toggleTransfer] = useToggle();
  const [isDepositeOpen, toggleDeposite] = useToggle();
  const [isWithdraw, toggleWithdraw] = useToggle();
  const [n, setN] = useState(0);
  const {hasAccounts, allAccounts} = useAccounts()
  const currentAccountInfos = useSbtcAssets(currentAccount, n)
  const hasCurrentName = allAccounts.find(account => account === currentAccount)

  const buttonGroup = (
    <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
      {isDepositeOpen && (
        <Deposite
          address={currentAccount}
          onClose={toggleDeposite}
        />
      )
      }
      {isWithdraw && (
        <Withdraw
          account={currentAccount}
          btc={currentAccountInfos?.isFrozen ? currentAccountInfos?.balance : 0}
          onClose={toggleWithdraw}
          setN={setN}
        />
      )
      }
      {isTransferOpen && (
        <Transfer
          key='modal-transfer'
          onClose={toggleTransfer}
          senderId={currentAccount}
          n={n}
          setN={setN}
        />
      )}

      <Button
        className="btnLists primaryBtn"
        onClick={toggleDeposite}
        isDisabled={!isApiReady || !currentAccount || !hasAccounts || !hasCurrentName}
      >
        {t('Top Up')}
      </Button>
      <Button
        className="btnLists defaultBtn"
        onClick={toggleWithdraw}
        isDisabled={!isApiReady || !currentAccount || !hasAccounts || !hasCurrentName}
      >
        {t('Withdrawals')}
      </Button>
      <Button
        className="btnLists defaultBtn"
        onClick={toggleTransfer}
        isDisabled={!isApiReady || !currentAccount || !hasAccounts || !hasCurrentName}
      >
        {t('Transfer')}
      </Button>

    </div>
  );

  return (
    <AssetCard buttonGroup={buttonGroup} logo={sbtcLogo}>
      <div className='details'>
        <DetailWrapper>
          <AssetLine>
            <AssetView
              assetsInfo={currentAccountInfos}
            />
          </AssetLine>
        </DetailWrapper>
      </div>
    </AssetCard>
  );
}
