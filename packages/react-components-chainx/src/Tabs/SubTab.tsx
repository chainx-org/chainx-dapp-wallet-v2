import React from 'react'
import {NavLink} from 'react-router-dom';
import {subItem} from '@polkadot/react-components-chainx/Tabs/types';
import styled from 'styled-components';

interface Props extends subItem {
  basePath: string;
  className?: string,
  name: string
}

const Wrapper = styled.div`
  border-bottom: 2px solid transparent;
  margin-bottom: -3px;
  @media only screen and (max-width: 768px) {
    padding: 1rem 0;
    border-bottom: 0;
  }
  > a{
    font-weight: 600;
    padding: 0.5rem 0.8rem 0.75rem;
    color: rgba(0,0,0,0.4) !important;
    &.tabLinkActive {
      color: rgba(0,0,0,0.8) !important;
      @media only screen and (max-width: 768px) {
        &.tabLinkActive {
          color: rgba(0, 0, 0, 0.8) !important;
          border-bottom-color: #ED2B89 !important;
          border-bottom:2px solid #F6C94A !important;
        }
      }
    }
  }
`
function  SubTab({className = '', subText, subName, isSubRoot, basePath, name}: Props): React.ReactElement<Props>{
  const to = isSubRoot
    ? `${basePath}/${subName}`
    : `${basePath}/${name}/${subName}`;

  return(
    <Wrapper>
      <NavLink
        activeClassName='tabLinkActive'
        className={`ui--Tab ${className}`}
        exact
        strict
        to={to}>
        {subText}
      </NavLink>
    </Wrapper>
  )
}

export default SubTab
