import type { BlockNumber } from '@polkadot/types/interfaces';

import { useContext, useEffect, useState } from 'react';
import { useApi } from './useApi';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';


interface NumberInfo {
    bestNumber: number,
}

export function useBestNumber(address = '', n = 0) {
    const { api, isApiReady } = useApi();
    // console.log(address, 'address')
    const defaultNumberValue = JSON.parse(JSON.stringify(window.localStorage.getItem('balanceFreeInfo'))) || {
        bestNumber: 0
    }
    const [state, setState] = useState<NumberInfo>({
        bestNumber: defaultNumberValue.endBlock,
    });
    const [stateNumber, setStateNumber] = useState(null)
    const { currentAccount } = useContext(AccountContext);

    useEffect((): void => {
        fetchNumber()

    }, [currentAccount, n, isApiReady]);

    async function fetchNumber() {
        if (address === '') {
            return;
        } else
            if (isApiReady) {
                try {
                    const res = await api.derive.chain.bestNumber(address);
                    setStateNumber(res)
                } catch (error) {
                    alert(error);
                }

            }
    }
    return stateNumber
}