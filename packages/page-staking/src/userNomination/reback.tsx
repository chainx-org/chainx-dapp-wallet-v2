// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { InputAddress, Modal, TxButton, Dropdown } from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { Available } from '@polkadot/react-query';
import { DropdownOptions } from '@polkadot/react-components/util/types';
import { TxCallback } from '@polkadot/react-components/Status/types';

interface Props {
  account?: string;
  options?: KeyringSectionOption[];
  redeemOptions: [];
  value?: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback
}

function ReBack({ account, onClose, options, redeemOptions, value, onSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [validatorId, setValidatorId] = useState<string | null | undefined>();
  const [amount, setAmount] = useState<string | undefined | number>();
  const [optionsId, setOptionsId] = useState<DropdownOptions>();

  // const transferrable = <span className='label'>{t<string>('transferrable')}</span>;

  return (
    <Modal
      header={t<string>('Redeem')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={account}
              help='The actual account you wish to reback account'
              isDisabled={!!account}
              label={t<string>('My Accounts')}
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
            <p>{t<string>('Redeem the current node')}</p>
          </Modal.Column>
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={value}
              isDisabled={!!value}
              help={t<string>('Redeem the current node')}
              hideAddress={true}
              label={t<string>('Redeem')}
              labelExtra={
                <span> </span>
              }
              onChange={(value) => {
                const filterOptions = redeemOptions.filter((item) => item.validatorId === value);
                const currentOptions: DropdownOptions = [];
                filterOptions.forEach((item, index) => {
                  const show = item.isShow
                  const all = <div style={{
                    display: "flex"
                  }}>
                    <div>金额: {item.text}</div>
                    <div style={{
                      display: show? "block": "none",
                      marginLeft: "20px"
                    }}>可赎回</div>
                    <div style={{
                      display: show? "none": "block",
                      marginLeft: "20px"
                    }}>预计可赎回时间: {item.locked}</div>
                  </div>
                  currentOptions.push(
                    {
                      text: all,
                      value: index + ''
                    }
                  );
                });

                setOptionsId(currentOptions);

                setValidatorId(value);
              }}
              options={
                options
              }
              type='allPlus'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Redeem the current node')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Dropdown
              defaultValue={optionsId?.length > 0 ? optionsId[0].value : ''}
              help={t<string>('Redeem ID')}
              label={t<string>('Redeem ID')}
              onChange={setAmount}
              options={optionsId || []}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Redeem ID')} </p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={account}
          icon='sign-in-alt'
          label={t<string>('Redeem')}
          onStart={onClose}
          params={[validatorId, amount]}
          onSuccess={onSuccess}
          tx='xStaking.unlockUnbondedWithdrawal'

        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(ReBack);
