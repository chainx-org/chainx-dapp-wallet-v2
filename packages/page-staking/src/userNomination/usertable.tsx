
import React, { useContext, useEffect, useState } from 'react';
import { AddressMini, Button } from '@polkadot/react-components';
import { AddressSmall } from '@polkadot/react-components-chainx';
import Vote from './vote';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { Nomination, UserInterest } from '@polkadot/react-hooks-chainx/types';
import { BlockAuthorsContext, FormatBalance } from '@polkadot/react-query';
import Reback from './reback';
import UnBound from './unbond';
import ReBond from './rebond'

import Claim from './claim';
import { useTranslation } from '../translate';
import { TxCallback } from '@polkadot/react-components/Status/types';
import { ValidatorInfo } from '../types';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import BN from 'bn.js';

interface Props {
  accountId?: string;
  nomination?: Nomination,
  userInterest?: string;
  onStausChange?: TxCallback;
  validatorInfoList: ValidatorInfo[];
}



function UserTable({ accountId, nomination, userInterest, onStausChange, validatorInfoList }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
//   const [rebonds, setReBonds] = useState(true);
//   const [hoursafter, sethoursafter] = useState<BN>();
  const {currentAccount} = useContext(AccountContext);
  const { lastBlockNumber } = useContext(BlockAuthorsContext);
  const {api} = useApi();
  const [isVoteOpen, toggleVote] = useToggle();
  const [isRebackOpen, toggleReback] = useToggle();
  const [isBoundOpen, toggleUnbound] = useToggle();
  const [isReBoundOpen, toggleRebound] = useToggle();

  const [isClaim, toggleClaim] = useToggle();

  const chunkes = nomination?.unbondedChunks ? nomination.unbondedChunks.reduce((total, record) => {
    return total + Number(record.value);
  }, 0) : 0;

  const redeemOptions: object[] = [];

  nomination?.unbondedChunks ? nomination?.unbondedChunks.map((item, index) => {
    redeemOptions.push({
      validatorId: nomination.validatorId,
      text: 'locked until:' + item.lockedUntil,
      value: index + ''
    });
  }) : {};
  
//   useEffect((): void => {
//     async function getNowHeighted() {
//       const lastHeight = await api.query.xStaking.lastRebondOf(currentAccount)
//       const lastHeights = JSON.parse(JSON.stringify(lastHeight))
//       const hisHeight = await api.query.xStaking.bondingDuration()
//       const hisHeights = JSON.parse(JSON.stringify(hisHeight))
//       const finalHeight = Number(lastHeights)+Number(hisHeights)
//       const lastBlocks = lastBlockNumber?.replace(',','')
//       if(finalHeight>parseInt(lastBlocks)){
//         setReBonds(true)
//         const lasthour = finalHeight - parseInt(lastBlocks)
//         const hourafter = lasthour
//         const hoursafters = new BN(hourafter)
//         sethoursafter(hoursafters)
//       }else {
//         setReBonds(false)
//       }
//     }
//     getNowHeighted()
//   }, [currentAccount,lastBlockNumber]);

  return (
    <tr>
      <td>
        <AddressSmall
          key={nomination?.validatorId}
          value={nomination?.validatorId}
          withLockedVote
        />
      </td>
      <td>
        <FormatBalance value={nomination?.nomination}></FormatBalance>
      </td>
      <td>
        <FormatBalance value={userInterest}></FormatBalance>
      </td>
      <td>
        <FormatBalance value={chunkes}></FormatBalance>
      </td>

      <td className='button' key="claim">
        {
          isClaim && (
            <Claim
              account={accountId}
              onClose={toggleClaim}

              value={nomination?.validatorId}
              onSuccess={onStausChange}
            />
          )
        }
        {isVoteOpen && (
          <Vote
            account={accountId}
            key="vote"
            onClose={toggleVote}


            value={nomination?.validatorId}
            onSuccess={onStausChange}
          />
        )}

        {
          isRebackOpen && (
            <Reback
              account={accountId}
              onClose={toggleReback}

              redeemOptions={redeemOptions}
              key="reback"
              onSuccess={onStausChange}
              value={nomination?.validatorId}
            />
          )
        }
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
          isReBoundOpen && (
            <ReBond
              account={accountId}
              onClose={toggleRebound}
              validatorInfoList={validatorInfoList}
              value={nomination?.validatorId}
              onSuccess={onStausChange}
              // rebond={rebonds}
              unamount={nomination?.nomination}
              // hoursafter={hoursafter}
            />
          )
        }

        <Button
          color="orange"
          icon='paper-plane'
          label={t<string>('Vote')}
          onClick={toggleVote}
        />
        <Button
          icon='paper-plane'
          label={t<string>('Claim Interest')}
          onClick={toggleClaim}
        />
        <Button
          icon='paper-plane'
          label={t<string>('UnBound')}
          onClick={toggleUnbound}
        />
        <Button
          icon='paper-plane'
          label={t<string>('ReBound')}
          onClick={toggleRebound}
        />
        {
          Number(chunkes) > 0 ? (
            <Button
              icon='paper-plane'
              label={t<string>('Unfreeze')}
              onClick={toggleReback}
            />
          ) : null
        }
      </td>
    </tr >

  )


};


export default React.memo(UserTable);
