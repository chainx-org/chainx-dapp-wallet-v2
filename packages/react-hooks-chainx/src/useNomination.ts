// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { Nomination, UserNominations, Dividended, UserInterest } from './types';
import { useApi } from '@polkadot/react-hooks//useApi';
import { useIsMountedRef } from '@polkadot/react-hooks/useIsMountedRef';


export async function getNominationAndDividedExternal(account, api) {
  const allNominations: Nomination[] = [];
  const allDividended: UserInterest[] = [];


  const res = await api.rpc.xstaking.getNominationByAccount(
    account
  );

  let currentNomination: any = {};
  // 该用户的所有投票
  const userNominations = JSON.parse(res);

  Object.keys(userNominations).forEach((key: string) => {
    currentNomination = userNominations[key] as Nomination;
    currentNomination = Object.assign(currentNomination, {
      validatorId: key
    });
    currentNomination = Object.assign(currentNomination, {
      account: account
    });
    allNominations.push(currentNomination as Nomination);
  });
  const userDividedRes = await api.rpc.xstaking.getDividendByAccount(
    account
  );
  let current: any = {};
  const dividedArray: Dividended[] = [];
  const userDivided = JSON.parse(userDividedRes);

  Object.keys(userDivided).forEach((key: string) => {
    current = {
      validator: key,
      interest: userDivided[key]
    };
    dividedArray.push(current);
  });

  const userInterest: UserInterest = {
    account: account,
    interests: dividedArray
  };

  allDividended.push(userInterest);


  let UserNominations = {
    allNominations: allNominations,
    allDividended: allDividended
  }
  return UserNominations
}

export default function useNomination(accounts: string[]): UserNominations {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UserNominations>({
    allNominations: [],
    allDividended: []
  });
  const { api } = useApi();

  useEffect((): void => {
    async function getNominationAndDivided(accounts: string[]) {
      const allNominations: Nomination[] = [];
      const allDividended: UserInterest[] = [];


      accounts.map(async (account, index) => {

        const res = await api.rpc.xstaking.getNominationByAccount(
          account
        );

        let currentNomination: any = {};
        // 该用户的所有投票
        const userNominations = JSON.parse(res);

        Object.keys(userNominations).forEach((key: string) => {
          currentNomination = userNominations[key] as Nomination;
          currentNomination = Object.assign(currentNomination, {
            validatorId: key
          });
          currentNomination = Object.assign(currentNomination, {
            account: account
          });
          allNominations.push(currentNomination as Nomination);
        });
        const userDividedRes = await api.rpc.xstaking.getDividendByAccount(
          account
        );
        let current: any = {};
        const dividedArray: Dividended[] = [];
        const userDivided = JSON.parse(userDividedRes);

        Object.keys(userDivided).forEach((key: string) => {
          current = {
            validator: key,
            interest: userDivided[key]
          };
          dividedArray.push(current);
        });

        const userInterest: UserInterest = {
          account: account,
          interests: dividedArray
        };

        allDividended.push(userInterest);
      })

      setState({
        allNominations: allNominations,
        allDividended: allDividended
      });
    }

    getNominationAndDivided(accounts);
  }, [mountedRef]);

  return state;
}
