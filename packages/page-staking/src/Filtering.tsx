// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import queryString from 'query-string';
import React, { useEffect } from 'react';
import { Input, Toggle } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { isString } from '@polkadot/util';
import styled from 'styled-components';
import { useTranslation } from './translate';
import Ledgend from './Ledgend';

interface Props {
  children?: React.ReactNode;
  className?: string;
  nameFilter: string;
  setNameFilter: (value: string) => void;
  setWithIdentity: (value: boolean) => void;
  withIdentity: boolean;
}

function Filtering ({ children, className, nameFilter, setNameFilter, setWithIdentity, withIdentity }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();

  // on load, parse the query string and extract the filter
  useEffect((): void => {
    const queryFilter = queryString.parse(location.href.split('?')[1]).filter;

    if (isString(queryFilter)) {
      setNameFilter(queryFilter);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <Input
        autoFocus
        isFull
        label={t<string>('Filter by name, address or index')}
        onChange={setNameFilter}
        value={nameFilter}
      />
      <div className='staking--optionsBar'>
        {children}
        {api.query.identity && (
          <Toggle
            className='staking--buttonToggle'
            label={t<string>('Only with an identity')}
            onChange={setWithIdentity}
            value={withIdentity}
          />
        )}
        <Ledgend />
      </div>
    </div>
  );
}

export default React.memo(styled(Filtering)`
  .staking--optionsBar {
    @media only screen and (max-width: 540px) {
      display: none;
    }
  }

`);
