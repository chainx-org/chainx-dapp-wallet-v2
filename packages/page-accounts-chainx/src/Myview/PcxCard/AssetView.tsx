import React from 'react';
import styled from 'styled-components';
import { FormatBalance } from '@polkadot/react-components-chainx';
import {useApi} from '@polkadot/react-hooks';
import {toPrecision} from '@polkadot/app-accounts-chainx/Myview/toPrecision';
import BigNumber from 'bignumber.js';
import { Icon } from '@polkadot/react-components';

const Title = styled.h6`
  margin: 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.32);
  line-height: 20px;
`;

const HelpValue = styled.span`
  margin-left: 4px;
  cursor: pointer;
  position: relative;
  z-index: 99;
  .helpCon {
    display: none;
    width: 312px;
    font-size: 12px;
    color: #282828;
    padding: 16px 20px;
    position: absolute;
    bottom: 26px;
    right: -144px;;
    background: rgba(255,255,255,1);
    border: 1px solid #EFEFEF;
    box-shadow: 0 4px 12px 0 rgba(0,0,0,0.12);
    border-radius: 10px;
    @media screen and (min-width:376px) and (max-width: 414px){
      bottom: 26px;
      right: -80px;
      &:after {
        left: 70% !important;
      }
    }
    @media screen and (max-width: 376px){
      bottom: 26px;
      right: -58px;
      &:after {
        left: 78% !important;
      }
    }
    &:after {
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #fff;
      content: "";
      position: absolute;
      width: 0;
      left: 50%;
      bottom: -5px
    }
  }
  &:hover .helpCon {
    display: block;
  }
`;

const Value = styled.div`
  margin: 4px 0 0;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
  font-weight: 600;

  &.bold{
    font-size: 24px;
    line-height: 36px;
  }
`;

type Props = {
  title: string,
  bold?: any,
  help?: string,
  value: number
}

const LoadingValue = styled.div`
  display: inline-block;
  vertical-align: baseline;
  white-space: nowrap;
  > .ui--FormatBalance-postfix {
    vertical-align: baseline;
  }
  >.ui--FormatBalance-unit {
    font-size: 0.825em;
    text-align: right;
  }
`

export default function ({ bold, title, value, help }: Props): React.ReactElement<Props> {
  const {isApiReady} = useApi();
  const preciseValue: BigNumber = new BigNumber(toPrecision(value, 8))
  const decimalsValue = preciseValue.toNumber().toFixed(4).slice(-4)
  const intValue = preciseValue.toNumber().toFixed(8).slice(0,-8)

  return (
    <div>
      <Title>
        {title}
        { help ?
        <HelpValue className="helpmsg">
          <Icon icon='question-circle' size='1x'/>
          <div className="helpCon">{help}</div>
        </HelpValue> : "" } 
      </Title>
      <Value className={bold ? 'bold' : ''}>
        {/* {props.value} */}
        {isApiReady ?<FormatBalance
          className='result'
          value={value}
          />:
          <>
          {/*<div>{preciseValue.toNumber().toFixed(4)}</div>*/}
          <LoadingValue>
            <span className='ui--FormatBalance-value"'>{intValue}</span>
            <span className='ui--FormatBalance-postfix'>{decimalsValue}</span>
            <span className='ui--FormatBalance-unit'>{'  PCX'}</span>
          </LoadingValue>
        </>
          }
      </Value>
    </div>
  );
}
