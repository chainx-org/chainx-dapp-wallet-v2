// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { Trans } from 'react-i18next';
import { Expander } from '@polkadot/react-components';
import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { formatBalance, isFunction } from '@polkadot/util';
import { useTranslation } from './translate';

interface Props {
  accountId?: string | null;
  className?: string;
  extrinsic?: SubmittableExtrinsic | null;
  isSendable: boolean;
  onChange?: (hasAvailable: boolean) => void;
  tip?: BN;
}

function PaymentInfo ({ accountId, className = '', extrinsic }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [dispatchInfo, setDispatchInfo] = useState<RuntimeDispatchInfo | null>(null);
  const mountedRef = useIsMountedRef();

  useEffect((): void => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    accountId && extrinsic && isFunction(extrinsic.paymentInfo) && isFunction(api.rpc.payment?.queryInfo) &&
      setTimeout((): void => {
        try {
          extrinsic
            .paymentInfo(accountId)
            .then((info) => mountedRef.current && setDispatchInfo(info))
            .catch(console.error);
        } catch (error) {
          console.error((error as Error).message);
        }
      }, 0);
  }, [api, accountId, extrinsic, mountedRef]);

  if (!dispatchInfo || !extrinsic) {
    return null;
  }

  return (
    <Expander
      className={className}
      summary={
        <Trans i18nKey='feesForSubmission'>
          {t<string>('Transaction fee')} <span className='highlight'>{formatBalance(dispatchInfo.partialFee, { withSiFull: true })}</span> ( 1microKSX=0.000001KSX )
        </Trans>
      }
    />
  );
}

export default React.memo(PaymentInfo);
