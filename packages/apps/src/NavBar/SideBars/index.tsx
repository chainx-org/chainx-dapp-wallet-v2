// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import {useApi, useToggle} from '@polkadot/react-hooks';
import {Icon} from '@polkadot/react-components';
import linkOut from '@polkadot/apps/NavBar/icons/Link out.svg';
import Endpoints from '@polkadot/apps/Endpoints/modals/Network';
import getApiUrl from '@polkadot/apps/initSettings';
import { useTranslation } from '../../translate';

import {Link} from 'react-router-dom';
import styled from 'styled-components';
import store from "store";

interface Props {
  className?: string;
  onClose?: () => void;
  isCollapsed?: boolean;
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 999;
  overflow-y: auto;
  box-shadow: 6px 0px 20px 0px rgba(0,0,0,0.3);
  width: 0;
  background: #fff;
  color: rgba(0,0,0,0.4);
  transition: all 0.3s linear;
  &.collapsed {
    width: 12em;
  }
  // &.expanded {

  // }
  &::-webkit-scrollbar {
    display: none;
  }
  .wrappers {
    width: 12em;
    .switchNode{
      display: flex;
      align-items: center;
      font-size: 12px;
      padding: 0.5em 1.3em 0.5em 1.3em;
      background: rgba(249, 249, 249);
      border: 1px solid #EFEFEF;
      border-radius: 18px;
      margin: 3.5rem 1rem 0.5rem;
      .netInfo{
        text-transform: capitalize;
        min-width: 5.5rem;
      }
      > div {
        margin-right: 0.5em;
        &.circle{
          height: 0.5em;
          width: 0.5em;
          border-radius: 50%;
          background: rgba(52, 198, 154);
        }
      }
      &:hover {
        color: rgba(0,0,0,0.8);
        cursor: pointer;
      }
    }

    ul {
      li {
        padding: 1em 0.8rem 1em 1.5rem;
        &.statusrisk {
          a {
            color: rgba(0,0,0,0.8);
          }
        }
        a {
          display: flex;
          align-items: center;
          color: rgba(0,0,0,0.4);
          svg {
            margin-right: 6px;
          }
          &:hover{
            color: rgba(0,0,0,0.8);
            cursor: pointer;
          }
        }
      }
    }
    .linkOutBrowser, .helpicon {
      padding: 1em 1.5em;
      a {
        color: rgba(0,0,0,0.4);
        svg {
          margin-right: 6px;
        }
        &:hover{
          color: rgba(0,0,0,0.8);
          cursor: pointer;
        }
      }
    }
    .linkOutBrowser {
      padding-left: 2em;
      a {
        display: flex;
        align-items: end;
        img {
          margin-left: 6px;
        }
      }
    }
  }
`

function Sidebars ({ className = '', onClose, isCollapsed }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const {api} = useApi()
  const [isEndpointsVisible, toggleEndpoints] = useToggle();
  const [url, setUrl] = useState<string>('')
  const [recordType, setRecordType] = useState(0);
  const apiUrl = getApiUrl()
  const [netInfo, setNetInfo] = useState<string>('')
  const stored = store.get('settings') as Record<string, unknown> || {};

  const nodeMap: {[key: string]: string} = {
    // 'wss://mainnet.chainx.org/ws': 'SherpaX node A',
    'wss://sherpax-testnet.chainx.org': t('Test Node'),
  }

  useEffect(() => {
    if (Object.keys(nodeMap).includes(apiUrl)) {
      setNetInfo(nodeMap[apiUrl])
    } else {
      setNetInfo(t('Test Node'))
    }
  }, [apiUrl, stored])

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

  const nodeList = ([
    {nodeName: t<string>('Assets'), link: '/accounts', icon: 'users'},
    // {nodeName: t<string>('Transaction'), link: '/transactionList', icon: 'users'},
    // {nodeName: t<string>('Stak. over.'), link: '/staking/staking', icon: 'certificate'},
    // {nodeName: t<string>('My Staking'), link: '/staking/nomination', icon: 'certificate'},
    // {nodeName: t<string>('Democracy'), link: '/democracy/democracy', icon: 'calendar-check'},
    // {nodeName: t<string>('Council'), link: '/democracy/council', icon: 'building'},
    // {nodeName: t<string>('Treasury'), link: '/democracy/treasury', icon: 'gem'},
    // {nodeName: t<string>('Trustee'), link: '/democracy/trustee', icon: 'coins'},
    {nodeName: t<string>('Explorer'), link: '/chainstate/explorer', icon: 'braille'}
  ]);



  function statusnode(node: any, index: number) {
    setRecordType(index)
    console.log(node,index)

  }

  return (
    <Wrapper
      className={`wrapernav ${isCollapsed ? 'collapsed' : 'expanded'}`}
    >
      <div className="wrappers">
        <div className='switchNode' onClick={toggleEndpoints}>
          <div className='circle'/>
          <div className='netInfo'>{netInfo}</div>
          <Icon icon='angle-down' size='1x'/>
        </div>
        <ul>
          {
            nodeList.map((node: any, index: number) =>
              <li key={index} className={` ${recordType === index ? "statusrisk" : ''}`} onClick={() => statusnode(node,index)}>
                <Link to={node.link} onClick={onClose}>
                  <Icon icon={node.icon} size='lg'/>
                  {node.nodeName}
                </Link>
              </li>
            )
          }
        </ul>

        <div className='helpicon' onClick={onClose}>
          <a href={t('https://chainx-doc.gitbook.io/chainx-user-guide-english/')} target='_blank'>
            <Icon icon='question-circle' size='lg'/>
            {t<string>('Help')}
          </a>
        </div>
        <div className='linkOutBrowser' onClick={onClose}>
          <a href={url} target='_blank'>
            {t('ChainScan')}
            <img src={linkOut} alt=""/>
          </a>
        </div>
        {isEndpointsVisible && (
          <Endpoints onClose={toggleEndpoints}/>
        )}
      </div>
    </Wrapper>
  );
}

export default Sidebars
