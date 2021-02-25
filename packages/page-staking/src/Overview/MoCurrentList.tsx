// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { Option, StorageKey } from '@polkadot/types';
import type { AccountId, EraIndex, Nominations } from '@polkadot/types/interfaces';
import type { Authors } from '@polkadot/react-query/BlockAuthors';
import type { SortedTargets, ValidatorInfo } from '../types';

import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useApi, useCall, useLoadingDelay } from '@polkadot/react-hooks';
import { BlockAuthorsContext } from '@polkadot/react-query';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import styled from 'styled-components';
import AddressData from './Address/AddressData';

const Wrapper = styled.div`
    @media only screen and (min-width: 540px) {
        display: none;
    }
    background: #FFFFFF;
    .addressLists {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid #CDCED2;
        .rightVote {
            display: flex;
            align-items: center;
            .number {
                margin-right: 8px;
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

function MoCurrentList({ favorites, hasQueries, isIntentions, next, stakingOverview, targets, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { byAuthor, eraPoints } = useContext(isIntentions ? EmptyAuthorsContext : BlockAuthorsContext);
  const recentlyOnline = useCall<DeriveHeartbeats>(!isIntentions && api.derive.imOnline?.receivedHeartbeats);
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

  const _renderRows = useCallback(
    (addresses?: AccountExtend[], isMain?: boolean): React.ReactNode[] =>
      (addresses || []).map(([address, isElected, isFavorite]): React.ReactNode => (
        <AddressData
          address={address}
          filterName={nameFilter}
          hasQueries={hasQueries}
          isElected={isElected}
          isFavorite={isFavorite}
          isMain={isMain}
          key={address}
          lastBlock={byAuthor[address]}
          nominatedBy={nominatedBy ? (nominatedBy[address] || []) : undefined}
          onlineCount={recentlyOnline?.[address]?.blockCount}
          onlineMessage={recentlyOnline?.[address]?.hasMessage}
          points={eraPoints[address]}
          toggleFavorite={toggleFavorite}
          validatorInfo={targets.find(item => item.account === address)}
          withIdentity={withIdentity}
        />
      )),
    [byAuthor, eraPoints, hasQueries, targets, nameFilter, nominatedBy, recentlyOnline, toggleFavorite, withIdentity]
  );

  return (
    <Wrapper> 
        <Filtering
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          setWithIdentity={setWithIdentity}
          withIdentity={withIdentity}
        />
        {isLoading ? t<string>('No active validators found') : _renderRows(validators, true)}
    </Wrapper>
  
  )
}

export default React.memo(MoCurrentList);
