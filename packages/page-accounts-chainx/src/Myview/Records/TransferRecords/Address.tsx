// import { useSelector } from 'react-redux'
// import { networkSelector } from '../reducers/settingsSlice'
// import { mainNetExplorer, testNetExplorer } from '../services/api'
// import { getChainx } from '../services/chainx'
import link from '../components/link.svg';
import linkHighlight from '../components/link-highlight.svg';
import React, {useEffect, useState} from 'react';
import LinkWrapper from '../components/LinkWrapper';
import {useApi} from '@polkadot/react-hooks';
import useTransition from '../../../useTransition';

export default function ({ address = '', mainnet = null }) {
  const {api} = useApi()
  const [url, setUrl] = useState<string>('')
  let result = useTransition(`0x${address}`);
  let ToAddress = address
  if (result?.length > 10) {
    result = result.substring(0, 5) + '...' + result.substring(result.length - 5);
  }
  if(address.length > 10) {
    ToAddress = address.substring(0, 5) + '...' + address.substring(address.length - 5);
  }
  console.log('result',result)
  useEffect(() => {
    async function fetchUrl() {
      const testOrMain = await api.rpc.system.properties();
      const testOrMainNum = JSON.parse(testOrMain);
      if (testOrMainNum.ss58Format === 44) {
        setUrl(`https://testnet-scan.chainx.org/accounts/${result}`)
      } else {
        setUrl(`https://scan.chainx.org/accounts/${result}`)
      }
    }

    fetchUrl()
  }, [])

  return (
    <LinkWrapper href={url} target='_blank'>
      <span title={result}>{result ? result : ToAddress}</span>
      <img alt='link'
        className='link'
        src={link} />
      <img
        alt='link-highlight'
        className='link-highlight'
        src={linkHighlight}
      />
    </LinkWrapper>
  );
}
