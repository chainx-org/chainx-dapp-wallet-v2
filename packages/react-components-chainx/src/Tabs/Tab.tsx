// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {ThemeProps} from '../types';
import type {TabItem} from './types';

import React from 'react';
import {NavLink} from 'react-router-dom';
import styled from 'styled-components';
import {Badge, Icon} from '@polkadot/react-components';
import SubTabs from '@polkadot/react-components-chainx/Tabs/SubTabs';
import {useLocation} from 'react-router-dom';

interface Props extends TabItem {
  basePath: string;
  className?: string;
  count?: number;
  index: number;
  isSequence?: boolean;
  num: number;
}

const Wrapper = styled.div`
  display: flex;
`;

function Tab({subItems, basePath, className = '', count, hasParams, index, isExact, isRoot, isSequence, name, num, text}: Props): React.ReactElement<Props> {
  const to = isRoot
    ? basePath
    : `${basePath}/${name}`;

  const location = useLocation();
  // only do exact matching when not the fallback (first position tab),
  // params are problematic for dynamic hidden such as app-accounts
  const tabIsExact = isExact || !hasParams || (!isSequence && index === 0);

  return (
    <Wrapper>
      <NavLink
        activeClassName='tabLinkActive'
        className={`ui--Tab ${className}`}
        // exact={tabIsExact}
        strict={tabIsExact}
        to={to}
      >
        {text}{(isSequence && index < (num - 1)) && (
        <Icon
          className='tabIcon'
          icon='arrow-right'
        />
      )}
        {!!count && (
          <Badge
            className='tabCounter'
            color='counter'
            info={count}
          />
        )}
      </NavLink>
      {
        subItems &&
        subItems.length > 0 &&
        location.pathname.includes(to) &&
        <SubTabs name={name} subItems={subItems} basePath={basePath}/>
      }
    </Wrapper>
  );
}

export default React.memo(styled(Tab)(({theme}: ThemeProps) => `
  border-bottom: 2px solid transparent;
  margin-bottom: -3px;
  padding: 0.5rem 1.5rem 0.75rem;
  color: rgba(0, 0, 0, 0.4) !important;
  font-weight: 600;
  @media only screen and (min-width: 769px) and (max-width: 1200px) {
    padding: 0.5rem 0.5rem 0.75rem;
  }
  @media only screen and (max-width: 768px) {
    display: none;
  }
  &.tabLinkActive {
    color: rgba(0, 0, 0, 0.8) !important;
    border-bottom-color: #ED2B89 !important;
  }

  &:hover {
    filter: highlight(120%);

    &:not(.tabLinkActive) {
      border-bottom-color: #e6e6e6;
    }
  }

  .tabCounter {
    margin: -1rem 0 -1rem 0.75rem;
  }

  .tabIcon {
    margin-left: 0.75rem;
  }
`));
