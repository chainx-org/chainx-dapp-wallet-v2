// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { Available, FormatBalance } from '@polkadot/react-query';
import { TxCallback } from '@polkadot/react-components/Status/types';
import InputPCXBalance from '@polkadot/react-components-chainx/InputPCXBalance';

interface Props {
  account?: string;
  options?: KeyringSectionOption[];
  value?: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback;
  unamount?:  string | null | undefined;
}

function UnBond({ account, onClose, options, value, onSuccess, unamount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [validatorId, setValidatorId] = useState<string | null | undefined>();
  const [amount, setAmount] = useState<BN | undefined>();

  const transferrable = <div>
    <span className='label web3ComingChat' style={{
      marginRight: "8px"
    }}>{t<string>('The amount of ticket revocable')}</span>
    <FormatBalance value={unamount}></FormatBalance>
  </div>;

  return (
    <Modal
      header={t<string>('UnBound')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={account}
              // help='The actual account you wish to UnBound account'
              isDisabled={!!account}
              label={t<string>('My Account')}
              labelExtra={transferrable}
              type='account'
            />
          </Modal.Column>
          {/* <Modal.Column>
            <p></p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={value}
              isDisabled={!!value}
              value={value}

              // help={t<string>('UnBound for validator')}
              hideAddress={true}
              label={t<string>('UnBound for validator')}
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
          {/* <Modal.Column>
            <p>{t<string>('UnBound Validator')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputPCXBalance
              autoFocus
              // help={t<string>('UnBound Amount')}
              label={t<string>('UnBound Amount')}
              onChange={setAmount}
            />
          </Modal.Column>
          {/* <Modal.Column>
            <p>{t<string>('UnBound Amount')}</p>
          </Modal.Column> */}
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={account}
          icon='sign-in-alt'
          label={t<string>('UnBound')}
          onStart={onClose}
          params={[validatorId, amount]}
          onSuccess={onSuccess}
          tx='xStaking.unbond'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(UnBond);
