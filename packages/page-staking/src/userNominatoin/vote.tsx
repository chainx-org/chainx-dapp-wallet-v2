// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';
import { InputBalance, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { TxCallback } from '@polkadot/react-components/Status/types';

import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { Available } from '@polkadot/react-query';

interface Props {
  account?: string;
  options?: KeyringSectionOption[];
  value?: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback;
}

function VoteNode({ account, onClose, options, value, onSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [validatorId, setValidatorId] = useState<string | null | undefined>();
  const [amount, setAmount] = useState<BN | undefined>();
  const [accountId, setAccount] = useState<string | null | undefined>();

  const transferrable = <span className='label'>{t<string>('transferrable')}</span>;

  return (
    <Modal
      header={t<string>('Vote')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={account}
              help='The actual account you wish to Vote account'
              isDisabled={!!account}
              label={t<string>('My Account')}
              labelExtra={
                <Available
                  label={transferrable}
                  params={accountId}
                />
              }
              onChange={setAccount}
              type='account'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Vote for the Node')}</p>
          </Modal.Column>
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={value}
              isDisabled={!!value}
              help={t<string>('Vote for Validator')}
              hideAddress={true}
              label={t<string>('Vote for Validator')}
              labelExtra={
                <span> </span>
              }
              onChange={setValidatorId}
              options={
                options
              }
              type='allPlus'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Current Vote Validator')}</p>
          </Modal.Column>
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputBalance
              autoFocus
              help={t<string>('Vote Amonut')}
              label={t<string>('Vote Amonut')}
              onChange={setAmount}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Vote Amonut')}</p>
          </Modal.Column>
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

        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(VoteNode);