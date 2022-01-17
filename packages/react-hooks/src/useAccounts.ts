// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContext, useEffect, useState } from 'react';
import keyring from '@polkadot/ui-keyring';
import {useApi} from '@polkadot/react-hooks';
import { useIsMountedRef } from './useIsMountedRef';
import { AccountContext } from '../../react-components-chainx/src/AccountProvider';

interface UseAccounts {
  allAccounts: string[];
  hasAccounts: boolean;
  isAccount: (address: string) => boolean;
}

export function useAccounts (): UseAccounts {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UseAccounts>({ allAccounts: [], hasAccounts: false, isAccount: () => false });
  const {isApiReady} = useApi();
  const { changeAccount } = useContext(AccountContext);

  useEffect((): () => void => {
    const subscription = keyring.accounts.subject.subscribe((accounts): void => {
      if (mountedRef.current) {
        const allAccounts = accounts ? Object.keys(accounts) : [];
        const hasAccounts = allAccounts.length !== 0;
        const isAccount = (address: string): boolean => allAccounts.includes(address);

        setState({ allAccounts, hasAccounts, isAccount });
      }
    });

    return (): void => {
      setTimeout(() => subscription.unsubscribe(), 0);
    };
  }, [mountedRef]);

  useEffect(() => {
    if (
      (window as any).web3 &&
      (window as any).web3.currentProvider &&
      (window as any).web3.currentProvider.isComingWallet &&
      (window as any).web3.comingUserInfo && isApiReady
    ) {
      const account = JSON.parse((window as any).web3.comingUserInfo).address
      const name = JSON.parse((window as any).web3.comingUserInfo).name
      // const publicKey = keyring.decodeAddress(account)
      // const encodedAddress = keyring.encodeAddress(publicKey, 44)
      changeAccount(account)
      setState({allAccounts:[account],hasAccounts: [account].length !== 0, isAccount:(address: string): boolean => [account].includes(address)});
    }
  }, [
    (window as any).web3 &&
      (window as any).web3.currentProvider &&
      (window as any).web3.currentProvider.isComingWallet && isApiReady
  ])

  return state;
}
