import React from 'react';
import styled from 'styled-components';
import {subItem} from '@polkadot/react-components-chainx/Tabs/types';
import SubTab from './SubTab';

const Wrapper = styled.div`
  display: flex;
  @media only screen and (min-width: 769px) {
    position: absolute;
    right: 1.3em;
    top: 1.9em;
  }
  .divideLine{
    height: 1.5em;
    padding: 0;
    background: #ADADAD;
    width: 1px;
    @media only screen and (max-width: 768px) {
      display: none;
    }
  }
`

interface Props {
  subItems: subItem[];
  basePath: string;
  name: string;
}

function SubTabs({subItems, basePath, name}: Props): React.ReactElement<Props>{

  return (
    <Wrapper>
      {subItems.map((item: subItem, index: number) =>
        <React.Fragment key={item.subName}>
        <SubTab {...item} basePath={basePath} name={name}/>
        {subItems.length - 1 !== index ? <div className='divideLine'/>: null}
        </React.Fragment>
      )}
    </Wrapper>
  )
}

export default SubTabs
