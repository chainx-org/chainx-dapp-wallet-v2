// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useMemo} from 'react';
import {Route, Switch} from 'react-router';
import {Tabs} from '@polkadot/react-components-chainx';
import Execute from './Execute';
import useDispatchCounter from './Execute/useCounter';
import Council from '@polkadot/app-council/Overview';
import Treasury from '@polkadot/app-treasury/Overview';
import Overview from './Overview';
import {useTranslation} from './translate';
import Trustee from '../../page-trust/src/components/Block';
import {useLocation} from 'react-router-dom';
import {useApi, useCall, useMembers, useTipHashes} from '@polkadot/react-hooks';
import {AccountId} from '@polkadot/types/interfaces';
import {Option} from '@polkadot/types';
import Motions from '@polkadot/app-council/Motions';
import {DeriveCollectiveProposal} from '@polkadot/api-derive/types';
import Tips from '@polkadot/app-treasury/Tips';
import Proposals from './techcomm/Proposals'
import Techcomm from './techcomm/Techcomm'
export {default as useCounter} from './useCounter';

interface Props {
  basePath: string;
}

const transformPrime = {
  transform: (result: Option<AccountId>): AccountId | null => result.unwrapOr(null)
};

function DemocracyApp({basePath}: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const { api } = useApi();
  const dispatchCount = useDispatchCounter();
  const { pathname } = useLocation();
  const prime = useCall<AccountId | null>(api.query.council.prime, undefined, transformPrime) || null;
  const motions = useCall<DeriveCollectiveProposal[]>(api.derive.council.proposals);
  const { isMember, members } = useMembers();
  const tipHashes = useTipHashes();

  const items = useMemo(() => [
    {
      name: 'democracy',
      text: t<string>('Democracy'),
      subItems: [
        {
          isSubRoot: true,
          subName: 'democracy',
          subText: t<string>('Democracy Overview')
        },
        {
          subName: 'dispatch',
          subText: t<string>('Dispatch')
        }
      ]
    },
    {
      name: 'council',
      text: t<string>('Council'),
      subItems: [
        {
          isSubRoot: true,
          subName: 'council',
          subText: t<string>('Council Overview')
        },
        {
          subName: 'motions',
          subText: t<string>('Motions')
        }
      ]
    },
    {
      name: 'treasury',
      text: t<string>('Treasury'),
      subItems: [
        {
          isSubRoot: true,
          subName: 'treasury',
          subText: t<string>('Treasury Overview')
        },
        {
          subName: 'tips',
          subText: t<string>('Tips')
        }
      ]
    },
    {
      name: 'techcomm',
      text: t<string>('Technical Committee'),
      subItems: [
        {
          isSubRoot: true,
          subName: 'techcomm',
          subText: t<string>('Tech. committee')
        },
        {
          subName: 'proposals',
          subText: t<string>('Proposals')
        }
      ]
    },
    {
      name: 'trustee',
      text: t<string>('Trustee')
    }
  ], [dispatchCount, t]);

  return (
    <main className='democracy--App'>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/council/motions`}>
          <Motions
            motions={motions}
            prime={prime}
          />
        </Route>
        <Route path={`${basePath}/council`}>
          <Council
            className={[basePath, `${basePath}/candidates`].includes(pathname) ? '' : 'council--hidden'}
            prime={prime}
          />
        </Route>
        <Route path={`${basePath}/trustee`}>
          <Trustee/>
        </Route>
        <Route path={`${basePath}/treasury/tips`}>
          <Tips
            hashes={tipHashes}
            isMember={isMember}
            members={members}
          />
        </Route>
        <Route path={`${basePath}/treasury`}>
          <Treasury
            isMember={isMember}
            members={members}
          />
        </Route>
        <Route path={`${basePath}/techcomm/proposals`}>
          <Proposals/>
        </Route>
        <Route path={`${basePath}/techcomm`}>
          <Techcomm/>
        </Route>
        <Route path={`${basePath}/democracy/dispatch`}>
          <Execute/>
        </Route>
        <Route>
          <Overview/>
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(DemocracyApp);
