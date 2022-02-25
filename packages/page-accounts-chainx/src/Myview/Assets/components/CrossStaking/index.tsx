
import React, { useContext, useEffect, useState } from 'react';
import { AddressMini, Button } from '@polkadot/react-components';
// import { AddressSmall } from '@polkadot/react-components-chainx';
import { useApi, useToggle } from '@polkadot/react-hooks';
// import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
// import { Nomination, UserInterest } from '@polkadot/react-hooks-chainx/types';
// import { BlockAuthorsContext, FormatBalance } from '@polkadot/react-query';
import Vote from './vote';
import UnBound from './unbond';
import Claim from './claim';
// import { TxCallback } from '@polkadot/react-components/Status/types';
// import { ValidatorInfo } from '../types';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { useTranslation } from '../../../../../../page-staking/src/translate';
import {Nomination, UserNominations, Dividended, UserInterest} from '@polkadot/react-hooks-chainx/types';
import {getNominationAndDividedExternal} from '@polkadot/react-hooks-chainx/useNomination';

function CrossStaking(): React.ReactElement {
  const { t } = useTranslation();
  const {currentAccount} = useContext(AccountContext);
  // const { lastBlockNumber } = useContext(BlockAuthorsContext);
  const {api} = useApi();
  const [isVoteOpen, toggleVote] = useToggle();
  const [isBoundOpen, toggleUnbound] = useToggle();
  const [isClaim, toggleClaim] = useToggle();
  const [isLoading, setLoading] = useState<boolean>(true);
  //let { allDividended, allNominations } = useNomination([currentAccount]);

  const [state, setState] = useState<UserNominations>({
    allNominations: [],
    allDividended: []
  });
  // const redeemOptions: object[] = [];
  // nomination?.unbondedChunks ? nomination?.unbondedChunks.map((item, index) => {
  //   redeemOptions.push({
  //     validatorId: nomination.validatorId,
  //     text: 'locked until:' + item.lockedUntil,
  //     value: index + ''
  //   });
  // }) : {};
  const onStausChange = async (status) => {
    setLoading(false);
    let userNominations = await getNominationAndDividedExternal(currentAccount, api);
    setState(userNominations);
    setLoading(true);
  }
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
    <>
        {isVoteOpen && (
          <Vote
            account={currentAccount}
            key="vote"
            onClose={toggleVote}
            value={validNominations?.validatorId}
            onSuccess={onStausChange}
          />
        )}
        {
          isBoundOpen && (
            <UnBound
              account={currentAccount}
              onClose={toggleUnbound}
              onSuccess={onStausChange}
              key="unbond"
              unamount={validNominations?.nomination}
              value={validNominations?.validatorId}
            />
          )
        }
        {
          isClaim && (
            <Claim
              account={currentAccount}
              onClose={toggleClaim}
              value={validNominations?.validatorId}
              onSuccess={onStausChange}
            />
          )
        }
        <Button
          color="orange"
          icon='certificate'
          label={t<string>('Staking')}
          onClick={toggleVote}
        />
        <Button
          icon='sign-in-alt'
          label={t<string>('Redeem')}
          onClick={toggleUnbound}
        />
         <Button
          icon='coins'
          label={t<string>('Claim')}
          onClick={toggleClaim}
        />
    </>
  )
};

export default React.memo(CrossStaking);