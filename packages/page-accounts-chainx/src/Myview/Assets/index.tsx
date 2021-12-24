
import React from 'react';
import Xbtc from './XbtcCard';
import styled from 'styled-components';
// import MiningChart from '@polkadot/app-accounts-chainx/Myview/Assets/components/MiningRevenueChart/MiningChart';

const Wrapper = styled.section`
  // display:flex;
  // @media screen and (max-width:767px){
  //   display: flex;
  //   flex-direction: column;
  // }
  margin-top: 16px;
  & > div {
    // margin-top: 16px;
    // display: flex;

    &.first-line {
      // width: 70%;
      min-height: 282px;
      height: 100%;
      @media (max-width: 1439px) {
        width: 100%;
      }

      & > section {
        width: 100%;
        // display: flex;
        // flex-direction: column;
        &:not(:first-of-type) {
          margin-left: 16px;
        }
      }
    }

    &.second-line {
      & > section {
        width: calc(38% - 40px);
      }
    }
  }
`;

export default function (): React.ReactElement {
  return (
    <Wrapper>
      <div className='first-line'>
        <Xbtc />
      </div>
      {/* <MiningChart /> */}
    </Wrapper>
  );
}
