// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useMemo } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { BN_ONE, extractTime } from '@polkadot/util';
import { useTranslation } from '@polkadot/react-hooks/translate';

// import { useTranslation } from './translate';

type Result = [number, string, number];

const DEFAULT_TIME = new BN(6000);

export function useBlockTime (blocks = BN_ONE): Result {
  const { t } = useTranslation();
  const { api } = useApi();

  return useMemo(
    (): Result => {
      const blockTime = (
        api.consts.babe?.expectedBlockTime ||
        api.consts.difficulty?.targetBlockTime ||
        api.consts.timestamp?.minimumPeriod.muln(2) ||
        DEFAULT_TIME
      );
      
      const { days, hours, minutes, seconds } = extractTime(blockTime.mul(blocks).toNumber());
      const  timestamp = days*86400000+hours*3600000+minutes*60000+seconds*1000

      const timeStr = [
        days ? (days > 1) ? t<string>('{{days}} days', { replace: { days } }) : t<string>('1 day') : null,
        hours ? (hours > 1) ? t<string>('{{hours}} hrs', { replace: { hours } }) : t<string>('1 hr') : null,
        minutes ? (minutes > 1) ? t<string>('{{minutes}} mins', { replace: { minutes } }) : t<string>('1 min') : null,
        seconds ? (seconds > 1) ? t<string>('{{seconds}} s', { replace: { seconds } }) : t<string>('1 s') : null
      ]
        .filter((value): value is string => !!value)
        .slice(0, 2)
        .join(' ');

      return [
        blockTime.toNumber(),
        timeStr,
        timestamp
      ];
    },
    [api, blocks, t]
  );
}
