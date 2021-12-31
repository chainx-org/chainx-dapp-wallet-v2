
import React, {useEffect, useState} from 'react';
import link from './link.svg';
import linkHighlight from './link-highlight.svg';
import LinkWrapper from './LinkWrapper';
import {useApi} from '@polkadot/react-hooks';
import ScanUrl from './SherpaxScanUrl';

export default function ({ hash = '', length = 5 }) {
  const {api} = useApi()
  const [url, setUrl] = useState<string>('')
  let result: string = hash
  if (hash.length > 2 * length) {
    result = hash.substring(0, 5) + '...' + hash.substring(hash.length - 5)
  }
  const sherpaxScanUrl = ScanUrl()
  useEffect(() => {
    setUrl(`${sherpaxScanUrl}/trade/${hash}`)
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
