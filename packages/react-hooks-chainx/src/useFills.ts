import {useEffect, useState} from 'react';
import axios from 'axios';
import {useApi} from '@polkadot/react-hooks';

export default function useFills(isLoading: boolean): Fill[] {
  const api = useApi();
  const [state, setState] = useState<Fill[]>([]);
  let fillTimeId: any = '';
  async function fetchFills() {
    const testOrMain = await api.api.rpc.system.properties();
    const testOrMainNum = JSON.parse(testOrMain);
    let res;
    if (testOrMainNum.ss58Format === 44) {
      res = await axios.get('https://testnet-api.chainx.org/dex/fills/0?page=0&page_size=20');
    } else {
      res = await axios.get('https://api-v2.chainx.cc/dex/fills/0');
    }
    setState([
      ...res.data.items
    ]);
  }

  useEffect(() => {
    window.clearInterval(fillTimeId)
    fetchFills()
  }, [isLoading])

  useEffect(() => {
    fillTimeId = setInterval(() => {
      fetchFills();
    }, 5000);

    return () => window.clearInterval(fillTimeId)
  }, [fillTimeId]);

  return state;
}
