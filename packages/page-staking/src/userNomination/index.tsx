import React, {useRef, useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import {KeyringAddress} from '@polkadot/ui-keyring/types';
import {Table} from '@polkadot/react-components';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import {useApi} from '@polkadot/react-hooks';
import {getNominationAndDividedExternal} from '@polkadot/react-hooks-chainx/useNomination';
import {useTranslation} from '../translate';
import {Nomination, UserNominations, Dividended, UserInterest} from '@polkadot/react-hooks-chainx/types';

import UserTable from './usertable';
import {ValidatorInfo} from '../types';

interface Props {
  account: KeyringAddress;
  validatorInfoList: ValidatorInfo[];
  className?: string;
}


function UserNomination({className = '', validatorInfoList}: Props): React.ReactElement<Props> | null {
  const {t} = useTranslation();
  const {currentAccount} = useContext(AccountContext);
  const {api} = useApi();
  const [isLoading, setLoading] = useState<boolean>(true);
  //let { allDividended, allNominations } = useNomination([currentAccount]);

  const [state, setState] = useState<UserNominations>({
    allNominations: [],
    allDividended: []
  });
  

  useEffect((): void => {
    async function getNominationAndDivided() {
      setLoading(true);

      const allNominations: Nomination[] = [];
      const allDividended: UserInterest[] = [];
      const res = await api.rpc.xstaking.getNominationByAccount(
        currentAccount
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
          account: currentAccount
        });
        allNominations.push(currentNomination as Nomination);
      });
      const userDividedRes = await api.rpc.xstaking.getDividendByAccount(
        currentAccount
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
        account: currentAccount,
        interests: dividedArray
      };

      allDividended.push(userInterest);
      setLoading(false);
      setState({
        allNominations: allNominations,
        allDividended: allDividended
      });
    }

    getNominationAndDivided();
  }, [currentAccount]);

  const headerRef = useRef([
    [t<string>('My Stake'), 'start'],
    [t<string>('Number of votes'), 'start'],
    [t<string>('Number of interests'), 'start'],
    [t<string>('Freeze'), 'start'],
    [undefined, undefined, undefined, undefined, undefined, 'start']
  ]);
  const validNominations = state.allNominations.filter((nmn, index) => {
    const userInterests = state.allDividended.filter(dvd => dvd.account === currentAccount);
    const interestNode = userInterests[0]?.interests.find(i => i.validator === nmn.validatorId);
    const blInterestNode = Boolean(interestNode ? Number(interestNode?.interest) !== 0 : 0);
    const chunkes: number = nmn?.unbondedChunks ? nmn.unbondedChunks.reduce((total, record) => {
      return total + Number(record.value);
    }, 0) : 0;
    const blNomination: boolean = Boolean(Number(nmn.nomination) !== 0);
    return blNomination || Boolean(chunkes !== 0) || blInterestNode;
  });

  return (
    <div>
      <div className={`taboverhid ${className}`}>
        <Table
          empty={!isLoading}
          header={headerRef.current}
        >
          {
            currentAccount && validNominations.map((item, index) => {
              const userInterest = state.allDividended.find(item => item.account === currentAccount);
              if (item.account === currentAccount) {
                return <UserTable
                  accountId={currentAccount}
                  nomination={validNominations[index]}
                  validatorInfoList={validatorInfoList}
                  userInterest={userInterest?.interests?.find(item => item.validator === validNominations[index].validatorId)?.interest}
                  onStausChange={async (status) => {
                    setLoading(false);
                    let userNominations = await getNominationAndDividedExternal(currentAccount, api);
                    setState(userNominations);
                    setLoading(true);
                  }}
                />;
              } else {
                return null;
              }
            })
          }


        </Table>
      </div>
    </div>
  );
}


export default React.memo(styled(UserNomination)`
  &.taboverhid {
    overflow: auto;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
