
import React, {useEffect, useState} from 'react';
import LinkWrapper from './LinkWrapper';
import link from './link.svg';
import linkHighlight from './link-highlight.svg';
import ScanUrl from './SherpaxScanUrl';

export default function ({ address = '', length = 5 }) {
  let result = address;
  const [url, setUrl] = useState<string>('')
  if (address.length > 2 * length) {
    result =
      address.substring(0, 5) + '...' + address.substring(address.length - 5);
  }
  const sherpaxScanUrl = ScanUrl()
  useEffect(() => {  
    setUrl(`${sherpaxScanUrl}/account/${address}`)
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
