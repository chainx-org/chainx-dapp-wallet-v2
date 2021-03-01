// Copyright 2017-2020 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React, {useEffect, useState} from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

import FormatBalance from './FormatBalance';
import BN from 'bn.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function AvailableDisplay ({ children, className = '', label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances.all, [params]);
  const [availableBalance, setAvailableBalance] = useState<BN | undefined>(new BN(0))
  let result: number[] = []
  const MiscLockedList = allBalances?.lockedBreakdown.map(e => JSON.parse(JSON.stringify(e))) || []

  useEffect(() => {
    if(MiscLockedList && MiscLockedList.length > 0){
      for (let i=0;i< MiscLockedList.length; i++){
        if(MiscLockedList[i].reasons === 'Misc'){
          result.push(MiscLockedList[i].amount)
        }
      }
      let max: number;
      result.length > 0 ? max = Math.max(...result): max = 0
      setAvailableBalance(allBalances?.availableBalance.add(new BN(max)))
    }else{
      setAvailableBalance(allBalances?.availableBalance)
    }
  }, [allBalances])


  return (
    <FormatBalance
      className={className}
      label={label}
      value={availableBalance}
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(AvailableDisplay);
