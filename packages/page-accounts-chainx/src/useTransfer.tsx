import {useEffect, useState} from 'react';
import axios from 'axios';
import {useApi} from '@polkadot/react-hooks';

export interface Transfer {
  extrinsicHash: string,	
  blockHeight: number,	
  blockTime:number,	
  from:	string,	
  to:	string,	
  balance: string,
}

export default function useTransfer(currentAccount = ''): Transfer[] {
  const {api, isApiReady} = useApi();
  const [state, setState] = useState<Transfer[]>([]);
  // let transferTimeId: any = '';

  async function fetchTransfers(currentAccount: string) {
    const testOrMain = await api.rpc.system.properties();
    const testOrMainNum = JSON.parse(testOrMain);
    let res: any;
    if (testOrMainNum.ss58Format === 44) {
      res = await axios.get(`https://multiscan-api-pre.coming.chat/sherpax/balanceTransfer?address=${currentAccount}&page=0&page_size=20`);
    } else {
      res = await axios.get(`https://multiscan-api.coming.chat/sherpax/balanceTransfer?address=${currentAccount}&page=0&page_size=20`);
      // let res = await axios.get(`https://multiscan-api-pre.coming.chat/sherpax/balanceTransfer?address=5Escb2u24DLhTSJBkStrfQjQcdDe9XaP4wsa3EA9BGAhk8mu/transfers?page=0&page_size=10`);
    }
    setState(res.data.items);
  }

  useEffect((): void => {
    fetchTransfers(currentAccount);
  }, [currentAccount, isApiReady]);

  // useEffect(() => {
  //   if(transferTimeId){
  //     window.clearInterval(transferTimeId);
  //   }
  //   fetchTransfers(currentAccount);
  //   transferTimeId = setInterval(() => {
  //     fetchTransfers(currentAccount);
  //     window.clearInterval(transferTimeId)
  //   }, 5000);
  //   return () => window.clearInterval(transferTimeId);
  // }, [currentAccount]);

  return state;
}
