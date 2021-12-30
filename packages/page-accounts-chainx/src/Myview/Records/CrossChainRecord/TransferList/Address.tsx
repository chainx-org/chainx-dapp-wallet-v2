// import { useSelector } from 'react-redux'
// import { networkSelector } from '../reducers/settingsSlice'
// import { mainNetExplorer, testNetExplorer } from '../services/api'
// import { getChainx } from '../services/chainx'
import link from '../../components/link.svg';
import linkHighlight from '../../components/link-highlight.svg';
import React, {useEffect, useState} from 'react';
import LinkWrapper from '../../components/LinkWrapper';
import {useApi} from '@polkadot/react-hooks';
import useTransition from '../../../../useTransition';

export default function ({ address = '', mainnet = null }) {
  const {api} = useApi()
  const [url, setUrl] = useState<string>('')
  let ToAddress = address
  if(address.length > 10) {
    ToAddress = address.substring(0, 5) + '...' + address.substring(address.length - 5);
  }
  useEffect(() => {
    async function fetchUrl() {
      const testOrMain = await api.rpc.system.properties();
      const testOrMainNum = JSON.parse(testOrMain);
      if (testOrMainNum.ss58Format === 44) {
        setUrl(`https://testnet-scan.chainx.org/accounts/${ToAddress}`)
      } else {
        setUrl(`https://scan.chainx.org/accounts/${ToAddress}`)
      }
    }

    fetchUrl()
  }, [])

  return (
    <LinkWrapper href={url} target='_blank'>
      <span title={ToAddress}>{ToAddress}</span>
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
