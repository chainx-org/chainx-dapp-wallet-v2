import React from 'react';
import PcxCard from './PcxCard';
import Assets from './Assets';
import styled from 'styled-components';
import Records from './Records';
import {ActionStatus} from '@polkadot/react-components/Status/types';
import {useApi} from '@polkadot/react-hooks';
import {AccountLoading} from '@polkadot/react-components-chainx';

const Wrapper = styled.div`
  padding: 16px 0;
  margin: auto;
  width: 1280px;
  display: flex;
  position: relative;

  @media screen and (max-width:1023px){
    display: flex;
    flex-direction: column;
    div.left {
      width: 100% !important;
    }
    div.right {
      width: 100% !important;
      margin: 16px 0 !important;
    }
  }

  div.left {
    flex: 1;
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  div.right {
    width: 300px;
    margin: 0 0 0 16px;
    display: flex;
    flex-direction: column;
    & > section {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }

`;

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
  basePath: string;
}

function AssetManagement({onStatusChange}: Props): React.ReactElement<Props> {
  const {isApiReady} = useApi()
  return (
      <Wrapper className='wrapper'>
        <div className='left'>
          <PcxCard onStatusChange={onStatusChange}/>
          <Assets/>
        </div>
        <div className='right'>
          <Records/>
        </div>

        {!isApiReady && <AccountLoading />}
      </Wrapper>
  );
}

export default React.memo(AssetManagement);
