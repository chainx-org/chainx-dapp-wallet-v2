// Copyright 2017-2020 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {SubmittableExtrinsic, SubmittableExtrinsicFunction} from '@polkadot/api/types';
import type {RawParam} from '@polkadot/react-params/types';
import type {TypeDef} from '@polkadot/types/types';

import React, {useCallback, useEffect, useState} from 'react';
import {getTypeDef} from '@polkadot/types/create';
import Params from '@polkadot/react-params';
import {isUndefined} from '@polkadot/util';
import InputExtrinsic from '@polkadot/react-components/InputExtrinsic';
import paramComponents from '@polkadot/react-components/Params';


interface Props {
  className?: string;
  defaultArgs?: RawParam[];
  defaultValue: SubmittableExtrinsicFunction<'promise'>;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate?: boolean;
  label?: React.ReactNode;
  onChange: (method?: SubmittableExtrinsic<'promise'>) => void;
  onEnter?: () => void;
  onError?: (error?: Error | null) => void;
  onEscape?: () => void;
  withLabel?: boolean;
}

interface ParamDef {
  name: string;
  type: TypeDef;
}

interface CallState {
  extrinsic: {
    fn: SubmittableExtrinsicFunction<'promise'>;
    params: ParamDef[];
  },
  values: RawParam[];
}

function isValuesValid (params: ParamDef[], values: RawParam[]): boolean {
  return values.reduce((isValid, value): boolean =>
    isValid &&
    !isUndefined(value) &&
    !isUndefined(value.value) &&
    value.isValid, params.length === values.length
  );
}

function getParams({meta}: SubmittableExtrinsicFunction<'promise'>): { name: string; type: TypeDef }[] {
  return meta.args.map(({ name, type, typeName }): { name: string; type: TypeDef } => ({
    name: name.toString(),
    type: {
      ...getTypeDef(type.toString()),
      ...(typeName.isSome
          ? { typeName: typeName.unwrap().toString() }
          : {}
      )
    }
  }));
}

function getCallState (fn: SubmittableExtrinsicFunction<'promise'>, values: RawParam[] = []): CallState {
  return {
    extrinsic: {
      fn,
      params: getParams(fn)
    },
    values
  };
}

function ExtrinsicDisplay({defaultArgs, defaultValue, isDisabled, isError, isPrivate, label, onChange, onEnter, onError, onEscape, withLabel}: Props): React.ReactElement<Props> {
  const [{ extrinsic, values }, setDisplay] = useState<CallState>(() => getCallState(defaultValue, defaultArgs));

  useEffect((): void => {
    const isValid = isValuesValid(extrinsic.params, values);

    let method;

    if (isValid) {
      try {
        method = extrinsic.fn(...values.map(({ value }) => value));
      } catch (error) {
        onError && onError(error as Error);
      }
    } else {
      onError && onError(null);
    }

    onChange(method);
  }, [extrinsic, onChange, onError, values]);

  const _onChangeMethod = useCallback(
    (fn: SubmittableExtrinsicFunction<'promise'>) =>
      setDisplay(getCallState(fn)),
    []
  );

  const _setValues = useCallback(
    (values: RawParam[]) =>
      setDisplay(({ extrinsic }) => ({ extrinsic, values })),
    []
  );

  const {fn: {meta, method, section}, params} = extrinsic;


  if(section === 'xGatewayBitcoin' && method === 'signWithdrawTx'){
    params[0].type.type = 'string';
    if (params[0].type.sub && 'type' in params[0].type.sub) {
      params[0].type.sub.type = 'string';
    }
  }


  return (
    <div className='extrinsics--Extrinsic'>
      <InputExtrinsic
        defaultValue={defaultValue}
        help={meta?.docs.join(' ')}
        isDisabled={isDisabled}
        isError={isError}
        isPrivate={isPrivate}
        label={label}
        onChange={_onChangeMethod}
        withLabel={withLabel}
      />
      <Params
        key={`${section}.${method}:params` /* force re-render on change */}
        onChange={_setValues}
        onEnter={onEnter}
        onEscape={onEscape}
        overrides={paramComponents}
        params={params}
      />
    </div>
  );
}

export default React.memo(ExtrinsicDisplay);
