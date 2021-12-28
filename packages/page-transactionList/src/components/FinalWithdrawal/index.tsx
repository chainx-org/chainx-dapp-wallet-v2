
import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { toPrecision } from '../../../../page-accounts-chainx/src/Myview/toPrecision';

const Value = styled.span`
    
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
      {asset}
      <Value className='content'>{Withdrawal}</Value>
    </>
  );
}
