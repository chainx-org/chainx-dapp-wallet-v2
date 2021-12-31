
import React, {useEffect, useState} from 'react';
import {useApi} from '@polkadot/react-hooks';

export default function ScanUrl(){
  const {api} = useApi()
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    async function fetchUrl() {
      const testOrMain = await api.rpc.system.properties();
      const testOrMainNum = JSON.parse(testOrMain);
      if (testOrMainNum.ss58Format === 44) {
        setUrl(`http://sherpaxscan-pre.chainx.org`)
      } else {
        setUrl(`http://sherpaxscan.chainx.org`)
      }
    }
    fetchUrl()
  }, [])

  return url
}
