// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';

import React, { Dispatch, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import SummarySession from '@polkadot/app-explorer/SummarySession';
import { Button, CardSummary, IdentityIcon, Menu, SummaryBox } from '@polkadot/react-components';
import { BlockAuthorsContext, ValidatorsContext } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import { AddressSmall } from '@polkadot/react-components-chainx';
import { ValidatorInfo } from '../types';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { useAccounts, useToggle } from '@polkadot/react-hooks';
import Chill from '../models/chill';
import Validate from '../models/validate';
import { TxCallback } from '@polkadot/react-components/Status/types';

interface Props {
  className?: string;
  isVisible: boolean;
  next?: string[];
  nominators?: string[];
  stakingOverview?: DeriveStakingOverview;
  targets: ValidatorInfo[];
  onStatusChange?: TxCallback;
  setN: Dispatch<number>;
}

function Summary({ className = '', isVisible, next, nominators, stakingOverview, targets, onStatusChange, setN }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { lastBlockAuthors, lastBlockNumber } = useContext(BlockAuthorsContext);
  const { currentAccount } = useContext(AccountContext);
  const { hasAccounts } = useAccounts();
  const [isValidateOpen, toggleValidate] = useToggle();
  const [isChillOpen, toggleChill] = useToggle();
  return (
    <SummaryBox className={`${className}${!isVisible ? ' staking--hidden' : ''}`}>
      <section>
        {stakingOverview && (
          <CardSummary label={t<string>('Elector')}>
            {stakingOverview.validatorCount.toString()} &nbsp;/&nbsp; {stakingOverview.validators.length}
          </CardSummary>
        )}

      </section>
      <section>
        <CardSummary
          className='validator--Summary-authors'
          label={t<string>('Last Block')}
        >
          {lastBlockAuthors?.map((author): React.ReactNode => (
            <IdentityIcon
              className='validator--Account-block-icon'
              key={author}
              value={author}
            />
          ))}
          {lastBlockNumber}
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='validator--Summary-authors'
          label={t<string>('Block Producer')}
        >
          {lastBlockAuthors?.map((author): React.ReactNode => (
            <AddressSmall value={author}  key={author} />
          ))}
        </CardSummary>
      </section>
      <section>
        {
          hasAccounts ? <span>{
            targets.find(item => item.account === currentAccount) ? (<span>
              {stakingOverview && (
                stakingOverview.CandidateorDrop[0].isChilled ? (
                    <Button
                      icon='plus'
                      onClick={toggleValidate}
                      label={t<string>('Candidate')}
                    />
                ):
                  <Button
                    icon='plus'
                    onClick={toggleChill}
                    label={t<string>('Drop')}
                  />
              )}
            </span>) :
              <SummarySession setN={setN} />
          }</span> : <span>
            <SummarySession setN={setN} />
          </span>
        }
        <div>
            {
              isValidateOpen && (
                  <Validate
                      onClose={toggleValidate}
                      validatorId={stakingOverview?.CandidateorDrop[0].account + ''}
                      onSuccess={onStatusChange}
                      account={currentAccount}
                      setN={setN}
                  />
              )
            }
            {
              isChillOpen && (
                  <Chill
                      onClose={toggleChill}
                      validatorId={stakingOverview?.CandidateorDrop[0].account + ''}
                      onSuccess={onStatusChange}
                      account={currentAccount}
                      setN={setN}
                  />
              )
            }

        </div>
      </section>
    </SummaryBox>
  );
}

export default React.memo(styled(Summary)`
  flex-wrap: wrap;
  align-items: center;

  label{
    text-align: center;
  }

  @media only screen and (min-width: 414px) and (max-width: 540px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    section:last-child {
      grid-column-start: 2;
      grid-row-start: 1;
    }
  }
  @media only screen and (max-width: 413px) {
    display: grid;
    position: relative;
    section:last-child {
      position: absolute;
      top: 28px;
      right: 0;
    }
  }

  .validator--Account-block-icon {
    display: inline-block;
    margin-right: 0.75rem;
    margin-top: -0.25rem;
    vertical-align: middle;
  }

  .validator--Summary-authors {
    .validator--Account-block-icon+.validator--Account-block-icon {
      margin-left: -1.5rem;
    }
  }
`);
