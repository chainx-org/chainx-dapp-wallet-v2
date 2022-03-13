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
  const {api, isApiReady} = useApi();
  const [state, setState] = useState<Transfer[]>([]);
  let transferTimeId: any = '';

  async function fetchTransfers(currentAccount: string) {
    const testOrMain = await api.rpc.system.properties();
    const testOrMainNum = JSON.parse(testOrMain);
    let res: any;
    if (testOrMainNum.ss58Format === 42) {
      res = await axios.get(`https://multiscan-api-pre.coming.chat/chainx/balanceTransfer?address=${currentAccount}&page=0&page_size=20`);
    } else {
      res = await axios.get(`https://multiscan-api.coming.chat/chainx/balanceTransfer?address=${currentAccount}&page=0&page_size=20`);
    }
    setState(res.data.items);
  }

  useEffect((): void => {
    isApiReady && api && fetchTransfers(currentAccount);
  }, [isApiReady, api, currentAccount]);

  useEffect(() => {
    if (!isApiReady || !api) { return }
    if(transferTimeId){
      window.clearInterval(transferTimeId);
    }
    fetchTransfers(currentAccount);
    transferTimeId = setInterval(() => {
      fetchTransfers(currentAccount);
      window.clearInterval(transferTimeId)
    }, 5000);

    return () => window.clearInterval(transferTimeId);
  }, [currentAccount, isApiReady, api]);

  return state;
}
