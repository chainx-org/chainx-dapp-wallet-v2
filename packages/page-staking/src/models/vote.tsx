// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, {useContext, useState} from 'react';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { TxCallback } from '@polkadot/react-components/Status/types';
import { InputPCXBalance, Available} from '@polkadot/react-components-chainx';
import styled from 'styled-components';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';

interface Props {
  validatorId: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback;
  remainingVotesData: string | undefined;
}

const VoteData = styled.span`
  > span.warning{
    color: red;
  }
`

function VoteNode({ onClose, validatorId, onSuccess, remainingVotesData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<BN | undefined>();
  const [accountId, setAccount] = useState<string | null | undefined>();
  const {currentAccount} = useContext(AccountContext)
  const voteable = <span className='label'>{t<string>('voteable')}</span>;
  const remainingVotes = (<VoteData className='label'>
    {t<string>('Remaining Votes')}
    {'： '}
    {remainingVotesData && Number(remainingVotesData) > 0 ? <span> {remainingVotesData}</span> :<span className='warning'>0</span>}
    {'  PCX'}
  </VoteData>)

  return (
    <Modal
      header={t<string>('Vote')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={currentAccount}
              help='The actual account you wish to vote account'
              label={t<string>('My Account')}
              isDisabled
              labelExtra={
                <Available
                  label={voteable}
                  params={accountId}
                />
              }
              onChange={setAccount}
              type='account'
            />
          </Modal.Column>
          {/* <Modal.Column>
            <p>{t<string>('Vote for validator')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={validatorId}
              help={t<string>('Vote for validator')}
              isDisabled={!!validatorId}
              label={t<string>('Vote for validator')}
              labelExtra={remainingVotes}
              type='allPlus'
            />
          </Modal.Column>
          {/* <Modal.Column>
            <p>{t<string>('Current vote validator')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputPCXBalance
              autoFocus
              help={t<string>('Vote Amount')}
              label={t<string>('Vote Amount')}
              onChange={setAmount}
            />
          </Modal.Column>
          {/* <Modal.Column>
            <p>{t<string>('Vote Amount')}</p>
          </Modal.Column> */}
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='sign-in-alt'
          label={t<string>('Vote')}
          onStart={onClose}
          params={[validatorId, amount]}
          tx='xStaking.bond'
          onSuccess={onSuccess}
          isDisabled={Number(remainingVotesData) <= 0}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(VoteNode);
