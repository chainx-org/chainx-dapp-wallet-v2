import {useEffect, useState} from 'react';
import axios from 'axios';
import {useApi} from '@polkadot/react-hooks';

export interface Transfer {
  assetId: number,
  fromAccountId: string,
  toAccountId: string,
  balance: string,
  blockNum: number,
  moduleId: string,
  eventId: string,
  extrinsicHash: string,
  blockTimestamp: number,
}

export default function useXsbtcTransfer(currentAccount = ''): Transfer[] {
  const {api, isApiReady} = useApi();
  const [state, setState] = useState<Transfer[]>([]);
  // let transferTimeId: any = '';

  async function fetchTransfers(currentAccount: string) {
    const testOrMain = await api.rpc.system.properties();
    const testOrMainNum = JSON.parse(testOrMain);
    let res: any;
    if (testOrMainNum.ss58Format === 44) {
      res = await axios.get(`https://multiscan-api-pre.coming.chat/sherpax/palletAssets/${currentAccount}/transfers?asset_id=1&page=0&page_size=20`);
    } else {
      res = await axios.get(`https://multiscan-api.coming.chat/sherpax/palletAssets/${currentAccount}/transfers?asset_id=1&page=0&page_size=20`);
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
