
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  max-height: 40px;
  color: #000000;
  @media screen and (max-width:540px){
    margin-bottom: 20px;
  }
  img {
    margin-right: 16px;
    width: 40px;
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
  font-size: 16px;
  line-height: 24px;
`;

const Desc = styled.span`
  margin: 0;
  opacity: 0.32;
  font-size: 12px;
  line-height: 16px;
`;

interface LogoProps{
  logo: any,
  name: any,
  tokenName: any
}

function Logo({logo, name, tokenName}: LogoProps) {
  return (
    <Wrapper>
      <img alt='logo' src={logo} />
      <div className='info'>
        <Title>{name}</Title>
        <Desc>{tokenName}</Desc>
      </div>
    </Wrapper>
  );
};
export default React.memo(Logo)
