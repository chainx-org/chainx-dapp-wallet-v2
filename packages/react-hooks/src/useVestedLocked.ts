import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { useApi } from './useApi';

interface VestedLocked {
    vestedLockedable: number
}

export function useVestedLocked(address = '', n = 0) {
    const { api, isApiReady } = useApi();
    const vestedLockedValue = JSON.parse(JSON.stringify(window.localStorage.getItem('vestedLocked'))) || {
        vestedLockedable: 0
    }
    const [vested, setVested] = useState<VestedLocked>({
        vestedLockedable: vestedLockedValue
    });

    const [vestedValue, setVestedValue] = useState(null)
    const { currentAccount } = useContext(AccountContext);
    useEffect((): void => {

        fetchVestedFree()

    }, [currentAccount, n, isApiReady]);

    async function fetchVestedFree() {
        
            if (isApiReady) {
                    const res = await api.derive.balances?.all(address);
                    const vestedBalance = res.vestedBalance
                    setVested(vestedBalance);
                    setVestedValue(vestedBalance)
            }
    }
    return vestedValue
}