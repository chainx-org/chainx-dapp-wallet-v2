
import { useApi } from '@polkadot/react-hooks';
import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import {useLocalStorage} from '@polkadot/react-hooks-chainx/index';

export default function usePcxFree(address = '',n = 0): PcxFreeInfo {
  const { api, isApiReady } = useApi();
  const [, setValue] = useLocalStorage('pcxFreeInfo')
  const defaultPcxFreeValue = JSON.parse(window.localStorage.getItem('pcxFreeInfo')) || {
    feeFrozen: 0,
    free: 0,
    miscFrozen: 0,
    reserved: 0,
  }
  const [state, setState] = useState<PcxFreeInfo>({
    feeFrozen: defaultPcxFreeValue.feeFrozen,
    free: defaultPcxFreeValue.free,
    miscFrozen: defaultPcxFreeValue.miscFrozen,
    reserved: defaultPcxFreeValue.reserved,
  });
  const { currentAccount } = useContext(AccountContext);

  useEffect((): void => {
    async function fetchPcxFree() {
      if (address === '') {
        return;
      }
      if(isApiReady) {
        const { data: balance } = await api.query.system.account(address);
        setValue(balance)
        setState(balance);
      }
    }

    isApiReady && fetchPcxFree();
  }, [currentAccount, n, isApiReady]);

  return <PcxFreeInfo>state;
}
