// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useEffect } from 'react';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { Available } from '@polkadot/react-query';
import { TxCallback } from '@polkadot/react-components/Status/types';

interface Props {
  account?: string;
  options?: KeyringSectionOption[];
  value?: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback

}

function Claim({ account, onClose, options, value, onSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [validatorId, setValidatorId] = useState<string | null | undefined>(value);
  // const transferrable = <span className='label'>{t<string>('transferrable')}</span>;


  return (
    <Modal
      header={t<string>('Claim Interests')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={account}
              help='The actual account you wish to claim'
              isDisabled={!!account}
              label={t<string>('My Account')}
              // labelExtra={
              //   <Available
              //     label={transferrable}
              //     params={account}
              //   />
              // }
              type='account'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Claim Interests')}</p>
          </Modal.Column>
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={value}
              isDisabled={!!value}
              help={t<string>('Claim Interests')}
              hideAddress={true}
              label={t<string>('Claim Interests')}
              labelExtra={
                <span> </span>
              }
              value={value}
              type='allPlus'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Current interest validator')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={account}
          icon='sign-in-alt'
          label={t<string>('Claim')}
          onStart={onClose}
          params={[validatorId]}
          tx='xStaking.claim'
          onSuccess={onSuccess}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Claim);
