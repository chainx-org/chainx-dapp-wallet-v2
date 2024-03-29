// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '@polkadot/react-components/types';
import type { KeyringStore } from '@polkadot/ui-keyring/types';

import React, { Suspense, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { HashRouter } from 'react-router-dom';
import { Api } from '@polkadot/react-api';
import Queue from '@polkadot/react-components/Status/Queue';
import { BlockAuthors, Events } from '@polkadot/react-query';
import settings from '@polkadot/ui-settings';
import { AccountProvider } from '@polkadot/react-components-chainx/AccountProvider';

import Apps from './Apps';
import WindowDimensions from './WindowDimensions';
import { darkTheme, lightTheme } from './themes';
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from './Web3Library';

interface Props {
  store?: KeyringStore;
}

function createTheme({ uiTheme }: { uiTheme: string }): ThemeDef {
  return uiTheme === 'dark'
    ? darkTheme
    : lightTheme;
}

function Root({ store }: Props): React.ReactElement<Props> {
  const [theme, setTheme] = useState(createTheme(settings));

  useEffect((): void => {
    settings.on('change', (settings) => setTheme(createTheme(settings)));
  }, []);

  return (
    <Suspense fallback='...'>
      <ThemeProvider theme={theme}>
        <AccountProvider>
          <Queue>
            <Api
              store={store}
              url={settings.apiUrl}
            >
              <BlockAuthors>
                <Events>
                  <Web3ReactProvider getLibrary={getLibrary}>
                    <HashRouter>
                      <WindowDimensions>
                        <Apps />
                      </WindowDimensions>
                    </HashRouter>
                  </Web3ReactProvider>
                </Events>
              </BlockAuthors>
            </Api>
          </Queue>
        </AccountProvider>
      </ThemeProvider>

    </Suspense>
  );
}

export default React.memo(Root);
