// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { Available, BlockToTime, FormatBalance } from '@polkadot/react-query';
import { TxCallback } from '@polkadot/react-components/Status/types';
import { ValidatorInfo } from '../types';
import InputPCXBalance from '@polkadot/react-components-chainx/InputPCXBalance';
import styled from 'styled-components';

interface Props {
  account?: string;
  options?: KeyringSectionOption[];
  value?: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback;
  validatorInfoList: ValidatorInfo[];
//   rebond: boolean;
//   hoursafter: BN | undefined;
  unamount?:  string | null | undefined;
}

const Wrapper = styled(Modal)`
  .content {
    div:nth-child(3) {
      .msg {
        .msgError {
          color: red;
          margin-top: 10px;
          p {
            display: inline-block;
          }
          div {
            display: inline-block;
          }
        }
      }
    }
  }
`;

function ReBond({ account, onClose, options, value, onSuccess, validatorInfoList, unamount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const [validatorTo, setValidatorTo] = useState<string | null | undefined>();
  const [amount, setAmount] = useState<BN | undefined>();
  let validatorOptionsArray: KeyringSectionOption[] = [];

  validatorInfoList.forEach((item: any) => {
    const cur = item as ValidatorInfo;
    validatorOptionsArray.push({
      key: cur.account,
      value: cur.account,
      name: cur.account
    })
  });


  const transferrable = <div>
    <span className='label web3ComingChat' style={{
      marginRight: "8px"
    }}>{t<string>('Switchable Amount')}</span>
    <FormatBalance value={unamount}></FormatBalance>
  </div> ;

  return (
    <Wrapper
      header={t<string>('Rebond')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={account}
              // help='The actual account you wish to register account'
              isDisabled={!!account}
              label={t<string>('My Account')}
              labelExtra={transferrable}
              type='account'
            />
          </Modal.Column>
          {/* <Modal.Column>
            <p>{t<string>('Rebond')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={value}
              isDisabled={!!value}
              value={value}
              // help={t<string>('From Validator')}
              hideAddress={true}
              label={t<string>('From Validator')}
              labelExtra={
                <span> </span>
              }
              // onChange={setValidatorFrom}
              // options={
              //   validatorOptions
              // }
              type='allPlus'
            />
          </Modal.Column>
          {/* <Modal.Column>
            <p>{t<string>('From Validator')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              // help={t<string>('To Validator')}
              hideAddress={true}
              label={t<string>('To Validator')}
              labelExtra={
                <span> </span>
              }
              onChange={setValidatorTo}
              options={
                validatorOptionsArray
              }
              value={(validatorInfoList && validatorInfoList?.length) > 0 ? validatorInfoList[0]?.account : ''}
              defaultValue={(validatorInfoList && validatorInfoList?.length) > 0 ? validatorInfoList[0]?.account : ''}
              type='allPlus'
            />
          </Modal.Column>
      {/* <Modal.Column className="msg">
            <p>{t<string>('To Validator')}</p>
            <div className="msgError" style={{display: (rebond === true) ? "block" : "none"}}>
              <p>{t<string>('Switch interval less than 3 days, please in')}</p>  
              <BlockToTime blocks={hoursafter} />
              <p>{t<string>('Retry after')}</p>
            </div>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <Modal.Column>
            <InputPCXBalance
              autoFocus
              // help={t<string>('Rebond Amount')}
              label={t<string>('Rebond Amount')}
              onChange={setAmount}
            />
          </Modal.Column>
          {/* <Modal.Column>
            <p>{t<string>('Rebond Amount')}</p>
          </Modal.Column> */}
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions onCancel={onClose}>
        <TxButton
         // isDisabled={rebond}
          accountId={account}
          icon='sign-in-alt'
          label={t<string>('Rebond')}
          onStart={onClose}
          params={[value, validatorTo, amount]}
          onSuccess={onSuccess}
          tx='xStaking.rebond'
        />
      </Modal.Actions>
    </Wrapper>
  );
}

export default React.memo(ReBond);
