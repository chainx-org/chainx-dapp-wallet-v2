
import React from 'react';
import styled from 'styled-components';
import logo from './chainx.svg';
import sherpax from './sherpax.svg';
import infoIcon from '../Logo/info.svg';
import Label from '@polkadot/app-trade/src/Module/MainContent/TradeForm/components/Label';

const Wrapper = styled.div`
  display: flex;
  max-height: 50px;
  img {
    margin-right: 20px;
    width: 50px;
  }

  section.info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const Title = styled.h6`
  margin: 0;
  opacity: 0.72;
  font-size: 18px;
  color: #000000;
  line-height: 28px;
  text-align: left;
`;

const Desc = styled.span`
  position: relative;
  left: -8px;
  margin: 0;
  font-size: 12px;
  color: #000000;
  font-weight: 400;
  background: rgba(50, 66, 255, 0.4);
  border-radius: 10px;
  padding: 2px 8px;
`;

export default function () {
  return (
    <Wrapper>
      <img alt='chainx logo'
        src={sherpax} />
      <section className='info'>
        <Title>KSX</Title>
        <Desc>Polkadot ChainX</Desc>
      </section>
    </Wrapper>
  );
}
