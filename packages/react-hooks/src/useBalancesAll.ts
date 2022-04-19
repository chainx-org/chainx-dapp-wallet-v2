import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { useApi } from './useApi';

interface BalanceFreeInfo {
    endBlock: number,
    locked: number,
    perBlock: number,
    vested: number,
    startingBlock: number
}

export function useBalancesAll(address = '', n = 0) {
    const { api, isApiReady } = useApi();
    const defaultBalanceFreeValue = JSON.parse(JSON.stringify(window.localStorage.getItem('balanceFreeInfo'))) || {
        endBlock: 0,
        locked: 0,
        perBlock: 0,
        vested: 0,
        startingBlock: 0
    }
    const [state, setState] = useState<BalanceFreeInfo>({
        endBlock: defaultBalanceFreeValue.endBlock,
        locked: defaultBalanceFreeValue.locked,
        perBlock: defaultBalanceFreeValue.perBlock,
        vested: defaultBalanceFreeValue.vested,
        startingBlock: defaultBalanceFreeValue.startingBlock
    });

    const [stateagain, setStateagain] = useState(null)
    const { currentAccount } = useContext(AccountContext);
    useEffect((): void => {

        fetchBalanceFree()

    }, [currentAccount, n, isApiReady]);

    async function fetchBalanceFree() {

        if (isApiReady) {
        
                const res = await api.derive.balances?.all(address);
                const vesting = res.vesting
                setState(vesting);
                setStateagain(vesting)
            

        }
    }
    return stateagain
}