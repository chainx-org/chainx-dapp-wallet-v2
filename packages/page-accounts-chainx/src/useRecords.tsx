import {useEffect, useState} from 'react';

import axios from 'axios';
import {useApi} from '@polkadot/react-hooks';

export interface Withdrawal {
  id: number,
  sendName: string,
  receiveName: string,
  hashAdd: string,
  price: number,
  createdAt: number
}

export interface Deposit {
  id: number,
  sendName: string,
  receiveName: string,
  hashAdd: string,
  price: number,
  createdAt: number
}

interface Records {
  Deposits: Deposit[]
  Withdrawals: Withdrawal[],
}

export default function useRecords(currentAccount = ''): Records {
  const api = useApi();
  const [state, setState] = useState<Records>({
    Deposits: [],
    Withdrawals: []
  });
  let withdrawalTimeId: any = null;

  async function fetchWithdrawals(currentAccount: string) {
    const testOrMain = await api.api.rpc.system.properties();
    const testOrMainNum = JSON.parse(testOrMain);
    let depositsList: any;
    let withdrawalsList: any;
    if (testOrMainNum.ss58Format === 42) {
      depositsList = await axios.get(`https://api-v2-pre.chainx.org/accounts/${currentAccount}/deposits?page=0&page_size=20`);
      withdrawalsList = await axios.get(`https://api-v2-pre.chainx.org/accounts/${currentAccount}/withdrawals?page=0&page_size=20`);
    } else {
      depositsList = await axios.get(`https://api-v2.chainx.org/accounts/${currentAccount}/deposits?page=0&page_size=20`);
      withdrawalsList = await axios.get(`https://api-v2.chainx.org/accounts/${currentAccount}/withdrawals?page=0&page_size=20`);
    }
    setState({
      Deposits :depositsList.data.items,
      Withdrawals :withdrawalsList.data.items
    });
  }

  useEffect((): void => {
    fetchWithdrawals(currentAccount);
  }, []);

  useEffect(() => {
    if(withdrawalTimeId){
      window.clearInterval(withdrawalTimeId);
    }
    fetchWithdrawals(currentAccount);
    withdrawalTimeId = setInterval(() => {
      fetchWithdrawals(currentAccount);
      window.clearInterval(withdrawalTimeId)
    }, 5000);

    return () => window.clearInterval(withdrawalTimeId);
  }, [currentAccount, withdrawalTimeId]);

  return state;
}
