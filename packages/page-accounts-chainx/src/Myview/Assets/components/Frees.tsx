
import React from 'react';
import styled from 'styled-components';
import { toPrecision } from '../../toPrecision';
import BN from 'bn.js'
const Title = styled.h6`
  margin: 0;
  opacity: 0.32;
  font-size: 12px;
  color: #000000;
  line-height: 16px;
`;

const Value = styled.p`
  margin: 4px 0 0;
  font-size: 24px;
  line-height: 18px;
  color: #000000;
`;

interface Props {
  asset: string | undefined,
  free: number,
  precision: number
}

export default function ({ asset, free, precision }: Props): React.ReactElement<Props> {
  return (
    <div style={{
      marginBottom: '10px'
    }}>
      <Title>{asset}</Title>
      <Value>
        <span>{free > 0 ? Number(toPrecision(free, precision)) : 0}</span>
      </Value>
    </div>
  );
}
