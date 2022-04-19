import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { useApi } from './useApi';
import { useLocalStorage } from '@polkadot/react-hooks-chainx/index';

interface VestedInfo {
    vestedClaimable: number
}

export function useVestClaim(address = '', n = 0) {
    const { api, isApiReady } = useApi();
    const [, setValue] = useLocalStorage('vestedInfo')
    const vestedClaimValue = JSON.parse(JSON.stringify(window.localStorage.getItem('vestedInfo'))) || {
        vestedClaimable: 0
    }
    const [vestState, setVestState] = useState<VestedInfo>({
        vestedClaimable: vestedClaimValue.vestedClaimable
    });

    const [vestedValue, setVestedValue] = useState(null)
    const { currentAccount } = useContext(AccountContext);
    useEffect((): void => {

        fetchClaimFree()

    }, [currentAccount, n, isApiReady]);

    async function fetchClaimFree() {
        if (address === '') {
            return;
        } else
            if (isApiReady) {
              
                    const res = await api.derive.balances?.all(address);
                    const vested = res.vestedClaimable
                    setVestState(vested);
                    alert(vested)
                    setVestedValue(vested)
              
            }
    }
    return vestedValue
}