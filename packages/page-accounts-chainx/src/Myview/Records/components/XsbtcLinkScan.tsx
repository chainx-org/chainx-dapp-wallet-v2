
import React, {useEffect, useState} from 'react';
import LinkWrapper from './LinkWrapper';
import link from './link.svg';
import linkHighlight from './link-highlight.svg';
import {useApi} from '@polkadot/react-hooks';

export default function ({ linkTo, status, length = 5 }) {
  const {api} = useApi()
  let result = linkTo;
  const [url, setUrl] = useState<string>('')
  if (linkTo.length > 2 * length) {
    result =
    linkTo.substring(0, 5) + '...' + linkTo.substring(linkTo.length - 5);
  }
  useEffect(() => {  
    async function fetchUrl() {
      const testOrMain = await api.rpc.system.properties();
      const testOrMainNum = JSON.parse(testOrMain);
      if (testOrMainNum.ss58Format === 44) {
        setUrl(`https://sherpaxscan-pre.chainx.org/${status}/${linkTo}`)
      } else {
        setUrl(`https://sherpaxscan.chainx.org/${status}/${linkTo}`)
      }
    }
    fetchUrl()
  }, [])
  return (
    <LinkWrapper href={url} target='_blank'>
      <span title={linkTo}>{result}</span>
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
