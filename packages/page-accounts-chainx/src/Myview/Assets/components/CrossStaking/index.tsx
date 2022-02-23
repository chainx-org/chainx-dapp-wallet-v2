
import React, { useContext, useEffect, useState } from 'react';
import { AddressMini, Button } from '@polkadot/react-components';
// import { AddressSmall } from '@polkadot/react-components-chainx';
// import Vote from './vote';
import { useApi, useToggle } from '@polkadot/react-hooks';
// import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
// import { Nomination, UserInterest } from '@polkadot/react-hooks-chainx/types';
// import { BlockAuthorsContext, FormatBalance } from '@polkadot/react-query';
// import Reback from './reback';
// import UnBound from './unbond';
// import ReBond from './rebond'
// import Claim from './claim';
// import { TxCallback } from '@polkadot/react-components/Status/types';
// import { ValidatorInfo } from '../types';
// import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { useTranslation } from '../../../../../../page-staking/src/translate';

function CrossStaking(): React.ReactElement {
  const { t } = useTranslation();
  // const {currentAccount} = useContext(AccountContext);
  // const { lastBlockNumber } = useContext(BlockAuthorsContext);
  // const {api} = useApi();
  const [isVoteOpen, toggleVote] = useToggle();
  const [isBoundOpen, toggleUnbound] = useToggle();
  const [isClaim, toggleClaim] = useToggle();
  // const redeemOptions: object[] = [];
  // nomination?.unbondedChunks ? nomination?.unbondedChunks.map((item, index) => {
  //   redeemOptions.push({
  //     validatorId: nomination.validatorId,
  //     text: 'locked until:' + item.lockedUntil,
  //     value: index + ''
  //   });
  // }) : {};

  return (
    <>
        {/* {isVoteOpen && (
          <Vote
            account={accountId}
            key="vote"
            onClose={toggleVote}
            value={nomination?.validatorId}
            onSuccess={onStausChange}
          />
        )}
        {
          isBoundOpen && (
            <UnBound
              account={accountId}
              onClose={toggleUnbound}
              onSuccess={onStausChange}
              key="unbond"
              unamount={nomination?.nomination}
              value={nomination?.validatorId}
            />
          )
        }
        {
          isClaim && (
            <Claim
              account={accountId}
              onClose={toggleClaim}
              value={nomination?.validatorId}
              onSuccess={onStausChange}
            />
          )
        } */}
        <Button
          color="orange"
          icon='paper-plane'
          label={t<string>('Staking')}
          onClick={toggleVote}
        />
        <Button
          icon='paper-plane'
          label={t<string>('Redeem')}
          onClick={toggleUnbound}
        />
         <Button
          icon='paper-plane'
          label={t<string>('Claim')}
          onClick={toggleClaim}
        />
    </>
  )
};

export default React.memo(CrossStaking);