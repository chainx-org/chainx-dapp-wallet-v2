
import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { toPrecision } from '../../../../page-accounts-chainx/src/Myview/toPrecision';
import CopyText from "../../CopyText";

const Value = styled.span`
  color: #4e4e4e;
  font-weight: 400;
  font-size: 14px;
`;

type Props = {
  asset: string | undefined,
  balance: number,
  free: number,
  precision: number
}

export default function FinalWithdrawal({ asset, balance, free, precision }: Props): React.ReactElement<Props> {
  const validBalace = new BigNumber(toPrecision(balance,precision));
  const validfee = new BigNumber(toPrecision(free,precision));
  const Withdrawal = new BigNumber(validBalace.minus(validfee)).toNumber()
  return (
    <>
      <CopyText text={Withdrawal.toString()}>
        <span className='title' style={{marginRight:'10px'}}> {asset}</span>
        <Value>{Withdrawal}</Value>
      </CopyText>
    </>
  );
}
