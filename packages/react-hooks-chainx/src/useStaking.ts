
import { useApi } from '@polkadot/react-hooks';
import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import {useLocalStorage} from '@polkadot/react-hooks-chainx/index';
import { Nomination } from './types';

export default function useStaking(address = '',n = 0) {
  const allNominations: Nomination[] = [];
  const { api, isApiReady } = useApi();
  const [, setValue] = useLocalStorage('redeemV')
  const defaultredeemV = JSON.parse(window.localStorage.getItem('redeemV')) || 0
  const [state, setState] = useState(defaultredeemV);
  const { currentAccount } = useContext(AccountContext);

  useEffect((): void => {
    async function fetchPcxFree() {
      if (address === '') {
        return;
      }

      const res = await api.rpc.xstaking.getNominationByAccount(
        address
      );
      let currentNomination: any = {};
      // 该用户的所有投票
      const userNominations = JSON.parse(res);

      Object.keys(userNominations).forEach((key: string) => {
        currentNomination = userNominations[key] as Nomination;
        currentNomination = Object.assign(currentNomination, {
          validatorId: key
        });
        currentNomination = Object.assign(currentNomination, {
          account: currentAccount
        });
        allNominations.push(currentNomination as Nomination);
      });
      const validNominations = allNominations.map((nmn, index) => {
        return  nmn?.unbondedChunks
      });
      const allRedreem = validNominations.map((item, index) => {
        const chunkes: number = item.reduce((total, record) => {
          return total + Number(record.value);
        }, 0)
        return chunkes
      })
      const allChunkes: number = allRedreem.reduce((total, value) => {
        return total + Number(value);
      }, 0)

      setValue(allChunkes)
      setState(allChunkes);
    }

    isApiReady && fetchPcxFree();
  }, [currentAccount, n, isApiReady]);

  return state;
}
