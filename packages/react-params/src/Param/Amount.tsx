// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types';
import type { Registry, TypeDef } from '@polkadot/types/types';

import BN from 'bn.js';
import React, { useCallback, useMemo } from 'react';
import { Input, InputNumber } from '@polkadot/react-components';
import { bnToBn, formatNumber, isUndefined } from '@polkadot/util';

import Bare from './Bare';

function getBitLength (registry: Registry, { type }: TypeDef): number {
  try {
    return registry.createType(type as 'u32').bitLength();
  } catch (error) {
    return 32;
  }
}

function Amount ({ className = '', defaultValue: { value }, isDisabled, isError, label, onChange, onEnter, registry, type, withLabel }: Props): React.ReactElement<Props> {
  const defaultValue = useMemo(
    () => isDisabled
      ? value instanceof registry.createClass('AccountIndex')
        ? value.toString()
        : formatNumber(value as number)
      : bnToBn((value as number) || 0).toString(),
    [isDisabled, registry, value]
  );

  const bitLength = useMemo(
    () => getBitLength(registry, type),
    [registry, type]
  );

  const _onChange = useCallback(
    (value?: BN) => onChange && onChange({
      isValid: !isUndefined(value),
      value
    }),
    [onChange]
  );

  return (
    <Bare className={className}>
      {isDisabled
        ? (
          <Input
            className='full'
            defaultValue={defaultValue}
            isDisabled
            label={label}
            withEllipsis
            withLabel={withLabel}
          />
        )
        : (
          <InputNumber
            bitLength={bitLength}
            className='full'
            defaultValue={defaultValue}
            isError={isError}
            isZeroable
            label={label}
            onChange={_onChange}
            onEnter={onEnter}
            withLabel={withLabel}
          />
        )
      }
    </Bare>
  );
}

export default React.memo(Amount);
