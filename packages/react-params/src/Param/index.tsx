// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props, Props as CProps } from '../types';

import React, { useMemo, useRef } from 'react';
import { classes } from '@polkadot/react-components/util';
import { encodeTypeDef } from '@polkadot/types/create';
import { isUndefined } from '@polkadot/util';

import findComponent from './findComponent';
import Static from './Static';

function formatJSON (input: string): string {
  return input
    .replace(/"/g, '')
    .replace(/\\/g, '')
    .replace(/:Null/g, '')
    .replace(/:/g, ': ')
    // .replace(/{/g, '{ ')
    // .replace(/}/g, ' }')
    .replace(/,/g, ', ');
}

function Param ({ className = '', defaultValue, isDisabled, isInOption, isOptional, name, onChange, onEnter, onEscape, overrides, registry, type }: Props): React.ReactElement<Props> | null {
  const Component = useMemo(
    () => findComponent(registry, type, overrides),
    [registry, type, overrides]
  );

  const label = useMemo(
    (): string => {
      const fmtType = formatJSON(`${isDisabled && isInOption ? 'Option<' : ''}${encodeTypeDef(registry, type)}${isDisabled && isInOption ? '>' : ''}`);

      return `${isUndefined(name) ? '' : `${name}: `}${fmtType}${type.typeName && !fmtType.includes(type.typeName) ? ` (${type.typeName})` : ''}`;
    },
    [isDisabled, isInOption, name, registry, type]
  );

  if (!Component) {
    return null;
  }

  return isOptional
    ? (
      <Static
        defaultValue={defaultValue}
        label={label}
        type={type}
      />
    )
    : (
      <Component
        className={`ui--Param ${className}`}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isInOption={isInOption}
        key={`${name || 'unknown'}:${label}`}
        label={label}
        name={name}
        onChange={onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        overrides={overrides}
        registry={registry}
        type={type}
      />
    );
}

export default React.memo(Param);
