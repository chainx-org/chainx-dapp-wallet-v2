
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Pair {
  precision: number,
  unitPrecision: number,
  currencyPairQuote: number
}

export default function usePrecision(): Pair {
  const [state, setState] = useState<Pair>({});

  useEffect((): void => {
    async function fetchPairs() {
      const res = await axios.get('https://api-v2.chainx.cc/dex/pairs');

      setState({
        precision: res.data[0].tickDecimals,
        unitPrecision: res.data[0].pipDecimals,
        currencyPairQuote: res.data[0].currencyPair.quote
      });
    }

    fetchPairs();
  }, []);

  return state;
}
