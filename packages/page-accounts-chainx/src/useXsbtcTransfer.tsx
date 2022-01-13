import {useEffect, useState} from 'react';
import axios from 'axios';
import {useApi} from '@polkadot/react-hooks';
import getApiUrl from '../../apps/src/initSettings';

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
  const {isApiReady} = useApi();
  const apiUrl = getApiUrl();
  const [state, setState] = useState<Transfer[]>([]);
  // let transferTimeId: any = '';

  async function fetchTransfers(currentAccount: string) {
    let res: any;
    if (apiUrl.includes('mainnet')) {
      res = await axios.get(`https://multiscan-api.coming.chat/sherpax/palletAssets/${currentAccount}/transfers?asset_id=1&page=0&page_size=20`);
    } else {
      res = await axios.get(`https://multiscan-api-pre.coming.chat/sherpax/palletAssets/${currentAccount}/transfers?asset_id=1&page=0&page_size=20`);
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
