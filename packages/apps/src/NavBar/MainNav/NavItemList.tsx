import React, {useEffect, useState} from 'react';
import chainxLogo from '@polkadot/apps/NavBar/icons/ChainX_logo.svg';
import {Link} from 'react-router-dom';
import {Icon} from '@polkadot/react-components';
import linkOut from '@polkadot/apps/NavBar/icons/Link out.svg';
import Selector from '@polkadot/apps/NavBar/MainNav/Selector';
import {useTranslation} from '@polkadot/apps/translate';
import {useApi, useToggle} from '@polkadot/react-hooks';

function NavItemList(): React.ReactElement {
  const {t} = useTranslation();
  const {api} = useApi()
  const [isStakingOpen, , setToggleStaking] = useToggle();
  const [isGovernanceOpen, , setToggleGovernance] = useToggle();
  const [isDeveloperOpen, , setToggleDeveloper] = useToggle();
  const [url, setUrl] = useState<string>('')
  const stakingList = ([
    {nodeName: t<string>('Stak. over.'), link: '/staking/staking'},
    {nodeName: t<string>('My Staking'), link: '/staking/nomination'},
  ]);
  const governanceList = ([
    {nodeName: t<string>('Democracy'), link: '/democracy/democracy'},
    {nodeName: t<string>('Council'), link: '/democracy/council'},
    {nodeName: t<string>('Treasury'), link: '/democracy/treasury'},
    {nodeName: t<string>('Tech. comm.'), link: '/democracy/techcomm'},
    {nodeName: t<string>('Trustee'), link: '/democracy/trustee'}
  ]);
  const developerList = ([
    {nodeName: t<string>('Chain state'), link: '/chainstate/chainstate'},
    {nodeName: 'Extrinsics', link: '/chainstate/extrinsics'},
    {nodeName: t<string>('RPC Calls'), link: '/chainstate/rpc'},
    {nodeName: t<string>('Sign and verify'), link: '/chainstate/signing'},
    {nodeName: t<string>('Explorer'), link: '/chainstate/explorer'}
  ]);

  const toggleSelector = (value: 'staking' | 'governance' | 'developer') => {
    if (value === 'staking') {
      setToggleStaking(true);
      setToggleGovernance(false);
      setToggleDeveloper(false);
    } else if (value === 'governance') {
      setToggleStaking(false);
      setToggleGovernance(true);
      setToggleDeveloper(false);
    } else {
      setToggleStaking(false);
      setToggleGovernance(false);
      setToggleDeveloper(true);
    }
  };

  useEffect(() => {
    async function judgeNetwork() {
      const testOrMain = await api.rpc.system.properties();
      const testOrMainNum = JSON.parse(testOrMain);
      if (testOrMainNum.ss58Format === 42) {
        setUrl('https://testnet-scan.chainx.org/')
      } else {
        setUrl('https://scan.chainx.org/')
      }
    }

    judgeNetwork();
  }, []);

  return (
    <div className="left">
      <img src={chainxLogo} alt=""/>
      <ul>
        <li className='assets media--500'>
          <Link to={'/accounts'}>{t('Assets')}</Link>
        </li>
        <li className='staking media--600'
            onMouseEnter={() => toggleSelector('staking')}
            onMouseLeave={() => setToggleStaking(false)}
        >
          <Link to={'/staking/staking'}>
            {t('Staking')}
            <Icon icon='angle-down' size='1x'/>
          </Link>
          {isStakingOpen &&
          <Selector
            nodeList={stakingList} onMouseLeave={() => setToggleStaking(false)}
          />}
        </li>
        <li className='governance media--700'
            onMouseEnter={() => toggleSelector('governance')}
            onMouseLeave={() => setToggleGovernance(false)}>
          <Link to={'/democracy/democracy'}>
            {t('Governance')}
            <Icon icon='angle-down'/>
          </Link>
          {isGovernanceOpen &&
          <Selector nodeList={governanceList} onMouseLeave={() => setToggleGovernance(false)}
          />}
        </li>
        <li className='dex media--1100'>
          <Link to='/DEX'>{t('DEX')}</Link>
        </li>
        <li className='linkOutBrowser media--900'>
          <a href={url} target='_blank'>
            {t('ChainScan')}
            <img src={linkOut} alt=""/>
          </a>
        </li>
        <li className='divideLine media--1200'/>
        <li className='developer media--1000'
            onMouseEnter={() => toggleSelector('developer')}
            onMouseLeave={() => setToggleDeveloper(false)}>
          <Link to={'/chainstate/chainstate'}>
            {t('Developer')}
            <Icon icon='angle-down'/>
          </Link>
          {isDeveloperOpen &&
          <Selector nodeList={developerList} onMouseLeave={() => setToggleDeveloper(false)}/>}
        </li>
      </ul>
    </div>
  );
}

export default NavItemList;
