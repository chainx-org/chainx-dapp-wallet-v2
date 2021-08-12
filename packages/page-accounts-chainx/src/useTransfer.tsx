import {useEffect, useState} from 'react';
import axios from 'axios';
import {useApi} from '@polkadot/react-hooks';

interface Transfer {
  id: number,
  sendName: string,
  receiveName: string,
  hashAdd: string,
  price: number,
  createdAt: number
}

export default function useTransfer(currentAccount = ''): Transfer[] {
  const api = useApi();
  const [state, setState] = useState<Transfer[]>([]);
  let transferTimeId: any = '';

  async function fetchTransfers(currentAccount: string) {
    const testOrMain = await api.api.rpc.system.properties();
    const testOrMainNum = JSON.parse(testOrMain);
    let res: any;
    if (testOrMainNum.ss58Format === 42) {
      res = await axios.get(`https://testnet-api.chainx.org/accounts/${currentAccount}/transfers?page=0&page_size=20`);
    } else {
      res = await axios.get(`https://api-v2.chainx.cc/accounts/${currentAccount}/transfers?page=0&page_size=20`);
      // let res = await axios.get(`https://api-v2.chainx.cc/accounts/5Escb2u24DLhTSJBkStrfQjQcdDe9XaP4wsa3EA9BGAhk8mu/transfers?page=0&page_size=10`);
    }
    setState(res.data.items);
  }

  useEffect((): void => {
    fetchTransfers(currentAccount);
  }, []);

  useEffect(() => {
    if(transferTimeId){
      window.clearInterval(transferTimeId);
    }
    fetchTransfers(currentAccount);
    transferTimeId = setInterval(() => {
      fetchTransfers(currentAccount);
      window.clearInterval(transferTimeId)
    }, 5000);

    return () => window.clearInterval(transferTimeId);
  }, [currentAccount]);

  return state;
}
