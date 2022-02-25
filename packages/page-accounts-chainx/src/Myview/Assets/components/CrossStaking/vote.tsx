// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { TxCallback } from '@polkadot/react-components/Status/types';
import InputSBTCBalance from '@polkadot/react-components-chainx/InputSBTCBalance';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { Available, FormatBalance } from '@polkadot/react-query';
import InputPCXBalance from '@polkadot/react-components-chainx/InputPCXBalance';
import { useTranslation } from '../../../../../../page-staking/src/translate';
import { useApi, useCall } from '@polkadot/react-hooks';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

interface Props {
  account?: string;
  options?: KeyringSectionOption[];
  value?: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback;
}

function VoteNode({ account, onClose, options, value, onSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [validatorId, setValidatorId] = useState<string | null | undefined>();
  const [amount, setAmount] = useState<BN | undefined>();
  const [accountId, setAccount] = useState<string | null | undefined>();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances.all, [accountId]);

//   const transferrable = <span className='label'>{t<string>('voteable')}</span>;
  const transferrable = <div>
  <span className='label' style={{
    marginRight: "8px"
  }}>{t<string>('voteable')}</span>
  <FormatBalance value={allBalances?.availableBalance}></FormatBalance>
  </div>;

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
              // help='The actual account you wish to Vote account'
              isDisabled={!!account}
              label={t<string>('My Account')}
              //   labelExtra={
              //     <Available
              //       label={transferrable}
              //       params={accountId}
              //     />
              //   }
              labelExtra={transferrable}
              onChange={setAccount}
              type='account'
            />
          </Modal.Column>
          {/* <Modal.Column>
            <p>{t<string>('Vote for the node')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={value}
              isDisabled={!!value}
              // help={t<string>('Vote for validator')}
              hideAddress={true}
              label={t<string>('Vote for validator')}
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
            <p>{t<string>('Current vote validator')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputSBTCBalance
              CrossToken={'PCX'}
              autoFocus
              // help={t<string>('Vote Amount')}
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

        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(VoteNode);
