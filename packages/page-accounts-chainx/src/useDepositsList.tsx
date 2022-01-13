import {useEffect, useState} from 'react';

import axios from 'axios';
import {useApi} from '@polkadot/react-hooks';
import getApiUrl from '../../apps/src/initSettings';

export interface Deposit {
    accountId: string,
    balance: string,
    blockNum: number
    blockTimestamp: number
    eventId: string
    extrinsicHash: string,
    hashCode: string,
    moduleId: string,
}

export default function useDepositsList(currentAccount = ''): Deposit[] {
  const {isApiReady} = useApi();
  const apiUrl = getApiUrl();
  const [state, setState] = useState<Deposit[]>([]);
//   let withdrawalTimeId: any = null;

  async function fetchDepositsList(currentAccount: string) {
    if(isApiReady) {
      let depositsList: any;
      if (apiUrl.includes('mainnet')){
        depositsList = await axios.get(`https://multiscan-api.coming.chat/sherpax/xgateway/${currentAccount}/deposits?page=0&page_size=20`);
      } else {
        depositsList = await axios.get(`https://multiscan-api-pre.coming.chat/sherpax/xgateway/${currentAccount}/deposits?page=0&page_size=20`);
      }
      setState(depositsList.data.items);
    }
  }

  useEffect((): void => {
    fetchDepositsList(currentAccount);
  }, [currentAccount, isApiReady]);

//   useEffect(() => {
//     if(withdrawalTimeId){
//       window.clearInterval(withdrawalTimeId);
//     }
//     fetchWithdrawals(currentAccount);
//     withdrawalTimeId = setInterval(() => {
//       fetchWithdrawals(currentAccount);
//       window.clearInterval(withdrawalTimeId)
//     }, 5000);
//     return () => window.clearInterval(withdrawalTimeId);
//   }, [currentAccount, withdrawalTimeId]);

  return state;
}
