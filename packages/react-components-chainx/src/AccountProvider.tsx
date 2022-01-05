
import React, { createContext, FC, useEffect, useState } from 'react';

import { useLocalStorage } from '@polkadot/react-hooks-chainx';

interface AccountAssetInfo {
  usableBalance: number;
  allBalance: number;
  freeFrozen: number;
}

export interface AccountContextData {
  currentAccount: string,
  changeAccount: (account: string) => void;
}

export const AccountContext = createContext<AccountContextData>({} as AccountContextData);

export const AccountProvider: FC = ({ children }) => {
  const [storedValue] = useLocalStorage<string>('currentAccount', '');
  const [currentAccount, setAccount] = useState<string>(storedValue);
  function changeAccount(account: string) {
    setAccount(account);
  }
  
  return (
    <AccountContext.Provider value={{
      currentAccount,
      changeAccount,
    }} >
      {children}
    </AccountContext.Provider>
  );
};
