
import React, {useEffect, useState} from 'react';
import LinkWrapper from './LinkWrapper';
import link from './link.svg';
import linkHighlight from './link-highlight.svg';
import getApiUrl from '../../../../../apps/src/initSettings';

export default function ({ linkTo, status, length = 5 }) {
  const apiUrl = getApiUrl();
  let result = linkTo;
  const [url, setUrl] = useState<string>('')
  if (linkTo.length > 2 * length) {
    result =
    linkTo.substring(0, 5) + '...' + linkTo.substring(linkTo.length - 5);
  }
  useEffect(() => {  
    async function fetchUrl() {
      if (apiUrl.includes('mainnet')) {
        setUrl(`https://scan.sherpax.io/${status}/${linkTo}`)
      } else {
        setUrl(`https://scan-pre.sherpax.io/${status}/${linkTo}`)
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
