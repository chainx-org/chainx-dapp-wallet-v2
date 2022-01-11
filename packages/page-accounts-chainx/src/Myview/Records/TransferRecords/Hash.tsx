
import React, {useEffect, useState} from 'react';
import link from '../components/link.svg';
import linkHighlight from '../components/link-highlight.svg';
import LinkWrapper from '../components/LinkWrapper';
import {useApi} from '@polkadot/react-hooks';

export default function ({ hash = '', length = 5 }) {
  const {api} = useApi()
  const [url, setUrl] = useState<string>('')
  let result: string = hash
  if (hash.length > 2 * length) {
    result = hash.substring(0, 5) + '...' + hash.substring(hash.length - 5)
  }

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
      <img className="link" src={link} alt="link" />
      <img
        alt='link-highlight'
        className='link-highlight'
        src={linkHighlight}
      />
    </LinkWrapper>
  );
}
