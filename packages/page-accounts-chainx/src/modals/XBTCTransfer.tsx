// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {Dispatch, useEffect, useState} from 'react';
import styled from 'styled-components';
import {InputAddress, Input, Modal, TxButton} from '@polkadot/react-components';

import {useTranslation} from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
  setN: Dispatch<number>
}

const P = styled.p`
  color: red;
`;

function Transfer({className = '', onClose, recipientId: propRecipientId, senderId: propSenderId, setN}: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const [amount, setAmount] = useState<string | undefined>();
  const [hasAvailable] = useState(true);
  const [recipientId, setRecipientId] = useState<string | null>(propRecipientId || null);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const [amountErrMsg, setAmountErrMsg] = useState('');
  useEffect(() => {
    if (Number(amount) <= 0) {
      setAmountErrMsg(t('Please enter a valid quantity'));
    } else {
      setAmountErrMsg('');
    }
  }, [amount]);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Send X-BTC')}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns>
            <Modal.Column>
              <InputAddress
                defaultValue={propSenderId}
                help={t<string>('The account you will send funds from.')}
                isDisabled={!!propSenderId}
                label={t<string>('Send from account')}
                labelExtra={
                  <span>
                  </span>
                }
                onChange={setSenderId}
                type='account'
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}</p>
            </Modal.Column>
          </Modal.Columns>
          <Modal.Columns>
            <Modal.Column>
              {/*<InputAddress*/}
              {/*  defaultValue={propRecipientId}*/}
              {/*  help={t<string>('Select a contact or paste the address you want to send funds to.')}*/}
              {/*  isDisabled={!!propRecipientId}*/}
              {/*  label={t<string>('Send to address')}*/}
              {/*  labelExtra={*/}
              {/*    <span>*/}
              {/*    </span>*/}
              {/*  }*/}
              {/*  onChange={setRecipientId}*/}
              {/*  type='allPlus'*/}
              {/*/>*/}
              <Input
                help={t<string>('Paste the address you want to send funds to.')}
                label={t<string>('Send to address')}
                onChange={setRecipientId}
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>('The beneficiary will have access to the transferred fees when the transaction is included in a block.')}</p>
            </Modal.Column>
          </Modal.Columns>
          <Modal.Columns>
            <Modal.Column>
              <Input
                autoFocus
                help={t<string>('Transfer X-BTC Amount')}
                isError={!hasAvailable}
                label={t<string>('Transfer X-BTC Amount')}
                onChange={setAmount}
                type={'number'}
              />
            </Modal.Column>
            <Modal.Column>
              <P>{amountErrMsg}</P>
            </Modal.Column>
          </Modal.Columns>
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={senderId}
          icon='paper-plane'
          isDisabled={!hasAvailable || !recipientId || !amount || (Number(amount) <= 0)}
          label={t<string>('Transfer')}
          onStart={onClose}
          onSuccess={() => {
            setN(Math.random());
          }}
          params={
            [recipientId, 1, Math.round(Number(amount) * Math.pow(10, 8))]
          }
          tx={'xAssets.transfer'}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Transfer)`
  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }

  .typeToggle {
    text-align: right;
  }

  .typeToggle+.typeToggle {
    margin-top: 0.375rem;
  }
`);
