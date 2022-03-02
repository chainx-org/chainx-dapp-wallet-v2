// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import { ComponentProps as Props, ModalProps } from './types';

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import modalCloseIcon from './modal-close.png';

import {useAccounts, useApi, useCall, useFavorites} from '@polkadot/react-hooks';
import Account from './AccountListItem';
import {Button, Modal, Table} from '@polkadot/react-components';
import Create from '@polkadot/app-accounts-chainx/modals/Create';
import Import from '@polkadot/app-accounts-chainx/modals/Import';
import { useTranslation } from '../translate';
import {sortAccounts} from '@polkadot/app-accounts-chainx/util';
import {SortedAccount} from '@polkadot/app-accounts-chainx/types';
import {ActionStatus} from '@polkadot/react-components/Status/types';
import {AccountId, ProxyDefinition, ProxyType} from '@polkadot/types/interfaces';
import BN from 'bn.js';
import keyring from '@polkadot/ui-keyring';

interface Props {
  setStoredValue: string | ((value: string) => void) | undefined;
  storedValue: string | ((value: string) => void) | undefined;
  onClose: () => void;
  onStatusChange: ((status: ActionStatus) => void) | undefined;
  className?: string;
}

const STORE_FAVS = 'accounts:favorites';

function AccountList({storedValue, className = '', onClose, onStatusChange, setStoredValue}: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isApiReady } = useApi();
  const {allAccounts} = useAccounts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAccounts, setSortedAccounts] = useState<SortedAccount[]>([]);
  const [sortedCCAccounts, setSortedCCAccounts] = useState<SortedAccount[]>([]);
  const [sortedAddresses, setSortedAddresses] = useState<string[]>([])
  let SortedAccounts: SortedAccount[] = [];

  const proxies = useCall<[ProxyDefinition[], BN][]>(api.query.proxy?.proxies.multi, [sortedAddresses], {
    transform: (result: [([AccountId, ProxyType] | ProxyDefinition)[], BN][]): [ProxyDefinition[], BN][] =>
      api.tx.proxy.addProxy.meta.args.length === 3
        ? result as [ProxyDefinition[], BN][]
        : (result as [[AccountId, ProxyType][], BN][]).map(([arr, bn]): [ProxyDefinition[], BN] =>
          [arr.map(([delegate, proxyType]): ProxyDefinition => api.createType('ProxyDefinition', { delegate, proxyType })), bn]
        )
  });

  useEffect((): void => {
    if (
      (window as any).web3 &&
      (window as any).web3.currentProvider &&
      (window as any).web3.currentProvider.isComingWallet &&
      (window as any).web3.comingUserInfo && isApiReady
    ) {
      const accounts = JSON.parse((window as any).web3.comingUserInfo).address
      const name = JSON.parse((window as any).web3.comingUserInfo).name
      const publicKey = keyring.decodeAddress(accounts)
      const CCaccount = [{
        account: {
          address: accounts,
          meta: {
            genesisHash: "",
            name: name,
            tags: [],
            whenCreated: 0
          },
          publicKey: publicKey,
        },
        children: [],
        isFavorite: favorites.includes(accounts)
      }]
      setSortedCCAccounts(CCaccount)
      setSortedAddresses([...allAccounts])
    } else {
      const accountsAfterSort = sortAccounts(allAccounts, []);
      accountsAfterSort.map((account, index) => {
        SortedAccounts.push(account);
      });
      setSortedAccounts(SortedAccounts);
      setSortedAddresses([...allAccounts])
    }
  }, [allAccounts, favorites]);
  const _toggleCreate = (): void => setIsCreateOpen(!isCreateOpen);
  const _toggleImport = (): void => setIsImportOpen(!isImportOpen);
  return (
    <Modal>
      <Wrapper className={className}>
        {isCreateOpen && (
          <Create
            onClose={_toggleCreate}
            onStatusChange={onStatusChange}
          />
        )}
        {isImportOpen && (
          <Import
            onClose={_toggleImport}
            onStatusChange={onStatusChange}
          />
        )}
        <> {  (window as any).web3 &&
              (window as any).web3.currentProvider &&
              (window as any).web3.currentProvider.isComingWallet &&
              (window as any).web3.comingUserInfo ?
              <>
                <div className={'overviewTab'}>
                  <div>
                    <p>{t('Current Accounts')}</p>
                  </div>
                </div>
               <Table>
               {sortedCCAccounts && sortedCCAccounts.map(({account, isFavorite}, index): React.ReactNode => (
                 <Account
                   account={account}
                   address={account.address}
                   isAccountChecked={storedValue === account.address}
                   isFavorite={isFavorite}
                   key={account.address}
                   setStoredValue={setStoredValue}
                   toggleFavorite={toggleFavorite}
                   proxy={proxies?.[index]}
                 />
               ))}
             </Table>
            </>
           :
          <>
          <div className={'overviewTab'}>
            <div>
              <p>{t('Choose Account')}</p>
            </div>
            <div>
              <Button
                icon={'plus'}
                label={t('Add account')}
                onClick={_toggleCreate}
              />
              <Button
                icon={'sync'}
                label={t('Restore JSON')}
                onClick={_toggleImport}
              />
            </div>
          </div>
          <Table>
            {sortedAccounts.map(({account, isFavorite}, index): React.ReactNode => (
              <Account
                account={account}
                address={account.address}
                isAccountChecked={storedValue === account.address}
                isFavorite={isFavorite}
                key={account.address}
                setStoredValue={setStoredValue}
                toggleFavorite={toggleFavorite}
                proxy={proxies?.[index]}
              />
            ))}
          </Table>
          </>
          }
          <img className="close-btn" src={modalCloseIcon} onClick={onClose}/>
        </>
        <Modal.Actions onCancel={onClose}></Modal.Actions>
      </Wrapper>
    </Modal>
  );
}

const Wrapper = styled.div`
  .actions {
    padding: 0 20px;
    div {
      margin: 0 0 1rem;
    }
    @media (min-width: 1024px) {
      display: none;
    }
  }
  .overviewTab{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px 15px 20px;
    margin: 0;
    p{
      font-size: 20px;
      color: #302B3C;
    }
  }
  .close-btn {
    @media (max-width: 1024px) {
      display: none;
    }
  }
  img{
    width: 48px;
    height: 48px;
    position: absolute;
    top: 0;
    right: -68px;
    cursor: pointer;
  }

  .account-box{
    width: 100%;
  }

  .account-item{
    padding: 15px 58px 15px 20px;
    border-top: 1px solid rgba(237,237,237,1);
  }

  .account-item:last-child{
    border-bottom: 1px solid rgba(237,237,237,1);
  }

  @media (max-width: 767px) {
    .overviewTab{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin: 0;
    .ui.primary.button {
      margin-right: 5px;
    }

    p{
      font-size: 16px;
      color: #302B3C;
    }
  }
  }
`;

export default styled(AccountList)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
  .noAccount{
      margin: 200px auto 0 auto;
      width: 630px;
      text-align: center;
      border: 1px solid #EDEDED;
      padding: 80px 100px;
      color: #302b3c;
      background: #fff;
      img{
        margin-bottom: 30px;
      }
      .h1{
        font-size: 20px;
        font-weight: bold;
      }
      p{
        font-size: 14px;
        margin-bottom: 40px;
      }
      button+button{
        margin-left: 30px;
      }
    }

    @media (max-width: 767px) {
      .noAccount{
        width: auto;
        padding: 40px 0px;
      }
    }
`;
