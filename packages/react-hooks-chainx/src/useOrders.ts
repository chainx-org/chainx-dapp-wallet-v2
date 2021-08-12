
import {useEffect, useState} from 'react';
import axios from 'axios';
import {useApi} from '@polkadot/react-hooks';

interface NowOrder {
  createdAt: number;
  id: number;
  pairId: number;
  price: number;
  amount: number;
  side: 'Sell' | 'Buy';
}

interface HistoryOrder{
  tradingHistoryIdx: number;
  turnover: number;
  price: number;
  pairId: number;
  blockTime: number;
}

interface Orders {
  NowOrders: NowOrder[];
  HistoryOrders: HistoryOrder[];
}

export default function useOrders(currentAccount = '', isLoading: boolean): Orders {
  const api = useApi();
  const [state, setState] = useState<Orders>({
    NowOrders: [],
    HistoryOrders: []
  });

  useEffect((): void => {
    async function fetchOrders(): Promise<void> {
      const testOrMain = await api.api.rpc.system.properties();
      const testOrMainNum = JSON.parse(testOrMain);
      const nowOrdersData  = await api.api.rpc.xspot.getOrdersByAccount(currentAccount, 0, 100)
      const nowOrdersList = JSON.parse(JSON.stringify(nowOrdersData)).data

      let historyOrdersList: any;
      if (testOrMainNum.ss58Format === 42) {
        historyOrdersList = await axios.get(`https://testnet-api.chainx.org/accounts/${currentAccount}/deals?page=0&page_size=10`)
      } else {
        historyOrdersList = await axios.get(`https://api-v2.chainx.cc/accounts/${currentAccount}/deals?page=0&page_size=10`)
      }
      setState({
        NowOrders: nowOrdersList,
        HistoryOrders: historyOrdersList.data.items
      });
    }

    fetchOrders()
  }, [currentAccount, isLoading]);

  return state;
}
