// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { Option, StorageKey } from '@polkadot/types';
import type { AccountId, EraIndex, Nominations } from '@polkadot/types/interfaces';
import type { Authors } from '@polkadot/react-query/BlockAuthors';
import type { SortedTargets, ValidatorInfo } from '../types';

import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall, useLoadingDelay } from '@polkadot/react-hooks';
import { BlockAuthorsContext } from '@polkadot/react-query';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';
import styled from 'styled-components';

const TableWrapper = styled(Table)`

  thead{
    tr{
      th:nth-child(2){
        text-align: left;
      }
      th:nth-child(5){
        text-align: right;
        transform: translateX(-1rem);
      }
    }
  }
`

interface Props {
  favorites: string[];
  hasQueries: boolean;
  isIntentions?: boolean;
  next?: string[];
  setNominators?: (nominators: string[]) => void;
  stakingOverview?: DeriveStakingOverview;
  targets: ValidatorInfo[];
  toggleFavorite: (address: string) => void;
}

type AccountExtend = [string, boolean, boolean];

interface Filtered {
  elected?: AccountExtend[];
  validators?: AccountExtend[];
  waiting?: AccountExtend[];
}

const EmptyAuthorsContext: React.Context<Authors> = React.createContext<Authors>({ byAuthor: {}, eraPoints: {}, lastBlockAuthors: [], lastHeaders: [] });

function filterAccounts(accounts: string[] = [], elected: string[], favorites: string[], without: string[]): AccountExtend[] {
  return accounts
    .filter((accountId): boolean => !without.includes(accountId as any))
    .map((accountId): AccountExtend => [
      accountId,
      elected.includes(accountId),
      favorites.includes(accountId)
    ])
    .sort(([, , isFavA]: AccountExtend, [, , isFavB]: AccountExtend): number =>
      isFavA === isFavB
        ? 0
        : (isFavA ? -1 : 1)
    );
}

function getFiltered(stakingOverview: DeriveStakingOverview, favorites: string[], next?: string[]): Filtered {
  const allElected = [""]
  //accountsToString(stakingOverview.nextElected);
  const validatorIds: string[] = stakingOverview.validators
  //accountsToString(stakingOverview.validators);
  const validators = filterAccounts(validatorIds, allElected, favorites, []);
  const elected = filterAccounts(allElected, allElected, favorites, validatorIds);
  const waiting = filterAccounts(next, [], favorites, allElected);

  return {
    elected,
    validators,
    waiting
  };
}

function extractNominators(nominations: [StorageKey, Option<Nominations>][]): Record<string, [string, EraIndex, number][]> {
  return nominations.reduce((mapped: Record<string, [string, EraIndex, number][]>, [key, optNoms]) => {
    if (optNoms.isSome && key.args.length) {
      const nominatorId = key.args[0].toString();
      const { submittedIn, targets } = optNoms.unwrap();

      targets.forEach((_validatorId, index): void => {
        const validatorId = _validatorId.toString();
        const info: [string, EraIndex, number] = [nominatorId, submittedIn, index + 1];

        if (!mapped[validatorId]) {
          mapped[validatorId] = [info];
        } else {
          mapped[validatorId].push(info);
        }
      });
    }

    return mapped;
  }, {});
}

function CurrentList({ favorites, hasQueries, isIntentions, next, stakingOverview, targets, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { byAuthor, eraPoints } = useContext(isIntentions ? EmptyAuthorsContext : BlockAuthorsContext);
  const nominators = useCall<[StorageKey, Option<Nominations>][]>(isIntentions && api.query.staking.nominators.entries as any);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [withIdentity, setWithIdentity] = useState(false);

  // we have a very large list, so we use a loading delay
  const isLoading = useLoadingDelay(3000);

  const { elected, validators, waiting } = useMemo(
    () => stakingOverview ? getFiltered(stakingOverview, favorites, next) : {},
    [favorites, next, stakingOverview]
  );

  const nominatedBy = useMemo(
    () => nominators ? extractNominators(nominators) : null,
    [nominators]
  );

  const headerActiveRef = useRef([
    [t('Validators'), 'start', 2],
    [t('Current Status'), 'expand'],
    [t('All Stake'), 'expand'],
    [t('Own Stake')],
    [t('Pots Balances')],
    [t('Last #')],
    [undefined, undefined, 3]
  ]);

  const _renderRows = useCallback(
    (addresses?: AccountExtend[], isMain?: boolean): React.ReactNode[] =>
      (addresses || []).map(([address, isElected, isFavorite]): React.ReactNode => (
        <Address
          address={address}
          filterName={nameFilter}
          hasQueries={hasQueries}
          isElected={isElected}
          isFavorite={isFavorite}
          isMain={isMain}
          key={address}
          lastBlock={byAuthor[address]}
          nominatedBy={nominatedBy ? (nominatedBy[address] || []) : undefined}
          points={eraPoints[address]}
          toggleFavorite={toggleFavorite}
          validatorInfo={targets.find(item => item.account === address)}
          withIdentity={withIdentity}
        />
      )),
    [byAuthor, eraPoints, hasQueries, targets, nameFilter, nominatedBy, toggleFavorite, withIdentity]
  );

  return (
    <TableWrapper
      empty={!isLoading && validators && t<string>('No active validators found')}
      filter={
        <Filtering
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          setWithIdentity={setWithIdentity}
          withIdentity={withIdentity}
        />
      }
      header={headerActiveRef.current}
    >
      {isLoading ? undefined : _renderRows(validators, true)}
    </TableWrapper>)
}

export default React.memo(CurrentList);
