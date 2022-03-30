// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BareProps as Props, ThemeDef, ThemeProps } from '@polkadot/react-components/types';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import AccountSidebar from '@polkadot/app-accounts-chainx/Sidebar';
import { getSystemChainColor } from '@polkadot/apps-config';
import GlobalStyle from '@polkadot/react-components-chainx/styles';
import { useAccounts, useApi } from '@polkadot/react-hooks';
import {useLocation} from 'react-router-dom'
import Signer from '@polkadot/react-signer';

import ConnectingOverlay from './overlays/Connecting';
import Content from './Content';
import WarmUp from './WarmUp';
import NavBar from './NavBar/index';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import AccountAlert from '@polkadot/react-components-chainx/AccountAlert';
import {useWeb3React} from '@web3-react/core'
import {Web3Provider} from '@ethersproject/providers'
import {injected} from './Web3Library'
export const PORTAL_ID = 'portals';

function Apps({className = ''}: Props): React.ReactElement<Props> {
  const {theme} = useContext<ThemeDef>(ThemeContext);
  const {systemChain, systemName, isApiReady} = useApi();
  const {allAccounts} = useAccounts()
  const [hasCurrentName, setHasCurrentName] = useState<boolean>(false)
  const {currentAccount} = useContext(AccountContext)
  const context = useWeb3React<Web3Provider>()
  const {connector, activate} = context
  const [activatingConnector, setActivatingConnector] = useState<any>()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  const {pathname} = useLocation()
  const hiddenHeaderList = ['']
  const [showHeader, setShowHeader] = useState(true)
  const uiHighlight = useMemo(
    () => getSystemChainColor(systemChain, systemName),
    [systemChain, systemName]
  );

  useEffect(() => {
    setHasCurrentName(!!allAccounts.find(account => account === currentAccount))
  }, [allAccounts, isApiReady, currentAccount])

  useEffect(() => {
    if (
      (window as any).web3 &&
      (window as any).web3.currentProvider &&
      (window as any).web3.currentProvider.isComingWallet
    ) {
      setActivatingConnector(injected)
      activate(injected)
    }
  }, [(window as any).web3])

  useEffect(()=>{
    hiddenHeaderList.includes(window.location.hash)?setShowHeader(false) : setShowHeader(true)
  },[pathname])

  return (
    <>
      <GlobalStyle uiHighlight={uiHighlight}/>
      <div className={`apps--Wrapper theme--${theme} ${className}`}>
        {/*<AccountAlert/>*/}
        {/*<NavBar/>*/}
        {showHeader && <NavBar/>}
        <AccountSidebar>
          <Signer>
            <Content/>
          </Signer>
          <ConnectingOverlay/>
          {isApiReady && !hasCurrentName && <AccountAlert/>}
          <div id={PORTAL_ID}/>
        </AccountSidebar>
      </div>
      <WarmUp/>
    </>
  );
}

export default React.memo(styled(Apps)(({theme}: ThemeProps) => `
  background: ${theme.bgPage};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`));
