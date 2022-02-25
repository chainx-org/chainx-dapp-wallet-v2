import React, {useContext, useEffect, useState} from 'react';
import XpcxLogo from './pcxLogo.png'
import {AssetLine, DetailWrapper} from '../components/common';
import {useAccounts, useApi, useToggle} from '@polkadot/react-hooks';
import Deposite from '../../../modals/CrossChainPCX/deposite'
import Withdraw from '../../../modals/CrossChainPCX/withdraw'
import Transfer from '../../../modals/CrossChainPCX/PCXTransfer';
import {useTranslation} from '@polkadot/app-accounts/translate';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import Button from '@polkadot/react-components-chainx/Button';
import CrossAssetCard from '../components/CrossAssetCard';
import CrossAssetView from '../components/CrossAssetView';
import usePCXAssets from '../../usePCXAssets';

export default function (): React.ReactElement {
  const {isApiReady} = useApi();
  const {t} = useTranslation();
  const {currentAccount} = useContext(AccountContext);
  const [isTransferOpen, toggleTransfer] = useToggle();
  const [isDepositeOpen, toggleDeposite] = useToggle();
  const [isWithdraw, toggleWithdraw] = useToggle();
  const [n, setN] = useState(0);
  const {hasAccounts, allAccounts} = useAccounts()
  const currentAccountInfo = usePCXAssets(currentAccount, n)
  console.log('pcx',currentAccountInfo)
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
          btc={currentAccountInfo?.balance}
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
        className="btnLists primaryBtn"
        onClick={toggleWithdraw}
        isDisabled={!isApiReady || !currentAccount || !hasAccounts || !hasCurrentName}
      >
        {t('Withdrawals')}
      </Button>
      <Button
        className="btnLists primaryBtn"
        onClick={toggleTransfer}
        isDisabled={!isApiReady || !currentAccount || !hasAccounts || !hasCurrentName}
      >
        {t('Transfer')}
      </Button>
    </div>
  );

  return (
    <CrossAssetCard buttonGroup={buttonGroup} logo={XpcxLogo} logoName='PCX' tokenName='Source Chain - ChainX' >
      <div className='details'>
        <DetailWrapper>
          <AssetLine>
            <CrossAssetView
              assetsInfo={currentAccountInfo}
            />
          </AssetLine>
        </DetailWrapper>
      </div>
    </CrossAssetCard>
  );
}
