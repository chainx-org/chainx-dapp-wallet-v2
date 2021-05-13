// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BareProps as Props, ThemeDef, ThemeProps } from '@polkadot/react-components/types';
import React, { useContext, useEffect, useMemo } from 'react';
import styled, { ThemeContext } from 'styled-components';
import AccountSidebar from '@polkadot/app-accounts-chainx/Sidebar';
import { getSystemChainColor } from '@polkadot/apps-config';
import GlobalStyle from '@polkadot/react-components-chainx/styles';
import { useApi } from '@polkadot/react-hooks';
import Signer from '@polkadot/react-signer';

import ConnectingOverlay from './overlays/Connecting';
import Content from './Content';
import Menu from './Menu';
import WarmUp from './WarmUp';
import NavBar from './NavBar/index';
import getApiUrl from '@polkadot/apps/initSettings';
import uiSettings from '@polkadot/ui-settings';
import { saveAndReload } from '@polkadot/app-settings/util';

export const PORTAL_ID = 'portals';

function Apps({className = ''}: Props): React.ReactElement<Props> {
  const {theme} = useContext<ThemeDef>(ThemeContext);
  const {systemChain, systemName} = useApi();
  const apiUrl = getApiUrl();

  const uiHighlight = useMemo(
    () => getSystemChainColor(systemChain, systemName),
    [systemChain, systemName]
  );

  useEffect(() => {
    if (apiUrl === 'wss://mainnet.spiderx.pro/ws') {
      saveAndReload({ ...(uiSettings.get()), apiUrl: 'wss://chainx.elara.patract.io' });
    }
  }, [])


return (
  <>
    <GlobalStyle uiHighlight={uiHighlight}/>
    <div className={`apps--Wrapper theme--${theme} ${className}`}>
      {/*<Menu />*/}
      <NavBar/>
      <AccountSidebar>
        <Signer>
          <Content/>
        </Signer>
        <ConnectingOverlay/>
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
