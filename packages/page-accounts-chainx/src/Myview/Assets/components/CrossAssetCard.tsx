import React, {ReactNode, useContext, useEffect, useState} from 'react';
import Logo from './Logo';
import styled from 'styled-components';
import {useTranslation} from '@polkadot/app-accounts/translate';

const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  @media screen and (max-width:540px){
    flex-direction: column;
    align-items: baseline;
  }
  .btnLists {
    color: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(0,0,0,0.04);
    padding: 1px 1.5em;
    white-space: nowrap;
    @media screen and (max-width:375px){
      padding: 1px 1em;
    }
    font-size: 0.875rem;
    min-width: 64px;
    box-sizing: border-box;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    font-family: Cairo, Arial, sans-serif;
    font-weight: 500;
    line-height: 1.75;
    border-radius: 14px;
    text-transform: none;
    margin-right: 8px;
  }
  .primaryBtn {
    background-color: #FFA1DB;
    &:hover {
      background-color: #ED2B89 !important;
      color: rgba(0, 0, 0, 0.7) !important;
      box-shadow: none;
    }
  }
  .defaultBtn {
    background-color: #F2F3F4;
    &:hover {
      background-color: #E8E9EA !important;
      color: rgba(0, 0, 0, 0.7) !important;
      box-shadow: none;
    }
  }
`;
const Wrapper = styled.div`
  padding: 16px;
  border-top: 1px solid #dce0e2;
`;

export default function (props: { children?: ReactNode, buttonGroup?: ReactNode, logo?: any, logoName?: string, tokenName?: string, footer?: ReactNode }) {
  const {logo, logoName, tokenName} = props;
  const {t} = useTranslation();

  return (
    <Wrapper>
      <HeadWrapper>
        <Logo 
            logo={logo}
            name={logoName}
            tokenName={tokenName}
        />
        {props.buttonGroup}
      </HeadWrapper>
      {props.children}
    </Wrapper>
  );
}
