// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import keyring from '@polkadot/ui-keyring';

import { useIsMountedRef } from './useIsMountedRef';

interface UseAccounts {
  allAccounts: string[];
  hasAccounts: boolean;
  isAccount: (address: string) => boolean;
}

export function useAccounts (): UseAccounts {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UseAccounts>({ allAccounts: [], hasAccounts: false, isAccount: () => false });

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
      (window as any).web3.comingUserInfo
    ) {
      const account = JSON.parse((window as any).web3.comingUserInfo).address
      const name = JSON.parse((window as any).web3.comingUserInfo).name
      const publicKey = keyring.decodeAddress(account)
      const encodedAddress = keyring.encodeAddress(publicKey, 44)
      setState({allAccounts:[encodedAddress],hasAccounts: [encodedAddress].length !== 0, isAccount:(address: string): boolean => [encodedAddress].includes(address)});
    }
  }, [
    (window as any).web3 &&
      (window as any).web3.currentProvider &&
      (window as any).web3.currentProvider.isComingWallet,
  ])

  return state;
}
