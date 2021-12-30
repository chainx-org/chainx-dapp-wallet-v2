import {useEffect, useState} from 'react';
import axios from 'axios';
import {useApi} from '@polkadot/react-hooks';

export default function useTransition(currentAccount = ''): string {
  const api = useApi();
  const [state, setState] = useState<Transfer>();
  let transferTimeId: any = '';

  async function fetchTransfers(currentAccount: string) {
    const testOrMain = await api.api.rpc.system.properties();
    const testOrMainNum = JSON.parse(testOrMain);
    let res: any;
    if (testOrMainNum.ss58Format === 44) {
      res = await axios.get(`https://multiscan-api-pre.coming.chat/transition?address=${currentAccount}`);
    } else {
      res = await axios.get(`https://multiscan-api.coming.chat/transition?address=${currentAccount}`);
    }
    setState(res.data.address);
  }

  useEffect((): void => {
    fetchTransfers(currentAccount);
  }, [currentAccount]);

  return state;
}
