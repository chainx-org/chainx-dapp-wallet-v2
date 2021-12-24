// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props, ThemeProps } from '@polkadot/react-components/types';
import React from 'react';
import styled from 'styled-components';


function transactionList({ basePath, className = '' }: Props): React.ReactElement<Props> {

  return (
    <main className={`staking--App ${className}`}>
      {/* <HelpOverlay md={basicMd as string} /> */}
      {/*<AccountSelect />*/}
      <header>

      </header>

    </main>
  );
}


export default React.memo(styled(transactionList)(({ theme }: ThemeProps) => `

`));
