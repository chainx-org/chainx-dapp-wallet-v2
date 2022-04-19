import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { useApi } from './useApi';

interface LockedBreakdown {
    lockedBreakdown: number
}

export function useLockedBreakdown(address = '', n = 0) {
    const { api, isApiReady } = useApi();
    const lockedBreakdownValue = JSON.parse(JSON.stringify(window.localStorage.getItem('lockedBreakdown'))) || {
        lockedBreakdown: 0
    }
    const [lockedBreakdown, setLockedBreakdown] = useState<LockedBreakdown>({
        lockedBreakdown: lockedBreakdownValue
    });

    const [lockedValue, setLockedValue] = useState(null)
    const { currentAccount } = useContext(AccountContext);
    useEffect((): void => {

        fetchDownFree()

    }, [currentAccount, n, isApiReady]);

    async function fetchDownFree() {
        if (address === '') {
            return;
        } else
            if (isApiReady) {
                const res = await api.derive.balances?.all(address);
                const lockedBreakdown = res.lockedBreakdown
                setLockedBreakdown(lockedBreakdown);
                setLockedValue(lockedBreakdown)
            }
    }
    return lockedValue
}