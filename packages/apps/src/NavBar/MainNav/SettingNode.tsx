import React, {useEffect, useState} from 'react';
import {Icon} from '@polkadot/react-components';
import {Link} from 'react-router-dom';
import AccountSelect from '@polkadot/apps/Menu/NodeInfo';
import {useToggle} from '@polkadot/react-hooks';
import Endpoints from '@polkadot/apps/Endpoints/modals/Network';
import getApiUrl from '@polkadot/apps/initSettings';
import {useTranslation} from '@polkadot/apps/translate';
import store from "store";

function SettingNode(): React.ReactElement {
  const {t} = useTranslation();
  const [isEndpointsVisible, toggleEndpoints] = useToggle();
  const apiUrl = getApiUrl()
  const [netInfo, setNetInfo] = useState<string>('')
  const stored = store.get('settings') as Record<string, unknown> || {};

  const nodeMap: {[key: string]: string} = {
    'wss://mainnet.chainx.org/ws': 'ChainX node A',
    'wss://testnet.chainx.org': t('Test Node'),
  }

  useEffect(() => {
    if (Object.keys(nodeMap).includes(apiUrl)) {
      setNetInfo(nodeMap[apiUrl])
    } else {
      setNetInfo(t('Test Node'))
    }
  }, [apiUrl, stored])

  return (
    <>
      <ul className="right">
        <li className='switchNode media--800' onClick={toggleEndpoints}>
          <div className='circle'/>
          <div className='netInfo'>{netInfo}</div>
          <Icon icon='angle-down' size='1x'/>
        </li>
        <li className='icon media--1100'>
          <a href={t('https://chainx-doc.gitbook.io/chainx-user-guide-english/')} target='_blank'>
            <Icon icon='question-circle' size='lg'/>
          </a>
        </li>
        <li className='icon media--1200'>
          <Link to='/settings/settings'>
            <Icon icon='cog' size='lg'/>
          </Link>
        </li>
        <li className='accountSelector'>
          <AccountSelect/>
        </li>
      </ul>
      {isEndpointsVisible && (
        <Endpoints onClose={toggleEndpoints}/>
      )}
    </>
  );
}

export default SettingNode;
