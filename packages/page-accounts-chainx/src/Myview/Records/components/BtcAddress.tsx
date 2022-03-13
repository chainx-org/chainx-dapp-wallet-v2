
import React, {useEffect, useState} from 'react';
import LinkWrapper from './LinkWrapper';
import link from './link.svg';
import linkHighlight from './link-highlight.svg';
import {useApi} from '@polkadot/react-hooks';

export default function ({ address = '', length = 5 }) {
  const {api} = useApi()
  let result = address;
  const [url, setUrl] = useState<string>('')
  if (address.length > 2 * length) {
    result =
      address.substring(0, 5) + '...' + address.substring(address.length - 5);
  }

  useEffect(() => {
    async function fetchUrl() {
      const testOrMain = await api.rpc.system.properties();
      const testOrMainNum = JSON.parse(testOrMain);
      if (testOrMainNum.ss58Format === 42) {
        setUrl(`https://scan-pre.chainx.org/account/${address}`)
      } else {
        setUrl(`https://scan.chainx.org/account/${address}`)
      }
    }

    fetchUrl()
  }, [])


  return (
    <LinkWrapper href={url} target='_blank'>
      <span title={address}>{result}</span>
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
