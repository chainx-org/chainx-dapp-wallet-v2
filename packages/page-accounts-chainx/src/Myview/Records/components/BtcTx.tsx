
import React, { useEffect, useState } from 'react';
import LinkWrapper from './LinkWrapper';
import link from './link.svg';
import linkHighlight from './link-highlight.svg';
import {useApi} from '@polkadot/react-hooks';

export default function ({ hash = '', length = 5 }) {
  // const host = network === 'testnet' ? btcTestNetHost : btcMainNetHost
  // const url = `${host}tx/${hash}`
  const {api} = useApi()

  let result = hash;

  if (hash.length > 2 * length) {
    result = hash.substring(0, 5) + '...' + hash.substring(hash.length - 5);
  }
  const [url, setUrl] = useState<string>('')
  useEffect(() => {
    async function fetchUrl() {
      const testOrMain = await api.rpc.system.properties();
      const testOrMainNum = JSON.parse(testOrMain);
      if (testOrMainNum.ss58Format === 42) {
        setUrl(`https://scan-pre.chainx.org/#/extrinsicDetails/${hash}`)
      } else {
        setUrl(`https://scan.chainx.org/#/extrinsicDetails/${hash}`)
      }
    }

    fetchUrl()
  }, [])


  return (
    <LinkWrapper href={url} target="_blank">
      <span>{result}</span>
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
