import {useEffect, useState} from 'react';

import axios from 'axios';
import {useApi} from '@polkadot/react-hooks';
import getApiUrl from '../../apps/src/initSettings';

export interface Withdrawal {
    addr: string,
    applicant: string,
    assetId: number
    balance: string,
    blockNum: number,
    blockTimestamp: number,
    eventId: string,
    ext: string,
    extrinsicHash: string,
    moduleId: string,
    withdrawStatus: string,
    withdrawalId: number,
}

export default function useWithdrawalsList(currentAccount = ''): Withdrawal[] {
    const {isApiReady} = useApi();
    const apiUrl = getApiUrl();
    const [state, setState] = useState<Withdrawal[]>([]);
//   let withdrawalTimeId: any = null;

  async function fetchWithdrawals(currentAccount: string) {
    if(isApiReady) {
      let withdrawalsList: any;
      if (apiUrl.includes('mainnet')) {
        withdrawalsList = await axios.get(`https://multiscan-api.coming.chat/sherpax/xgateway/${currentAccount}/withdrawals?page=0&page_size=20`);
      } else {
        withdrawalsList = await axios.get(`https://multiscan-api-pre.coming.chat/sherpax/xgateway/${currentAccount}/withdrawals?page=0&page_size=20`);
      }
      setState(withdrawalsList.data.items);
    }
  }

  useEffect((): void => {
    fetchWithdrawals(currentAccount);
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