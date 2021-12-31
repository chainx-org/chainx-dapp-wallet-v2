
import React, {useEffect, useState} from 'react';
import link from './link.svg';
import linkHighlight from './link-highlight.svg';
import LinkWrapper from './LinkWrapper';
import ScanUrl from './SherpaxScanUrl';

export default function ({ blockHeight }) {
  const [url, setUrl] = useState<string>('')
  const sherpaxScanUrl = ScanUrl()
  useEffect(() => {
    setUrl(`${sherpaxScanUrl}/blockDetails/${blockHeight}`)
  }, [])

  return (
    <LinkWrapper href={url} target="_blank">
      <span>{blockHeight}</span>
      <img className="link" src={link} alt="link" />
      <img
        alt='link-highlight'
        className='link-highlight'
        src={linkHighlight}
      />
    </LinkWrapper>
  );
}
