// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, {Dispatch, useEffect, useState} from 'react';
import {Input, InputAddress, Modal, TxButton} from '@polkadot/react-components';
import {InputXBTCBalance} from '@polkadot/react-components-chainx';
import {useTranslation} from '../../translate';
import styled from 'styled-components';
import {useApi, useCall} from '../../../../react-hooks/src'
import {toPrecision} from '../../Myview/toPrecision'

interface Props {
  onClose: () => void;
  btc: string | undefined | null;
  account: string | undefined,
  setN: Dispatch<number>
}

const Wrapper = styled(Modal)`
  > .content{
    > div > div:nth-child(2){
      display: flex;
      > span{
        margin-left: 1rem;
        color: red;
        width: 30px;
      }
    }
  }
  @media screen and (max-width:480px){
    .mob {
      flex-direction: column;
      align-items: inherit;
      .mobs {
        padding-left: 2rem;
      }
    }
  }
`;

function Withdraw({account, btc, onClose, setN}: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const {api} = useApi()
  const [amount, setAmount] = useState<BN | undefined>();
  const [memo, setMemo] = useState<string | null | undefined>();
  const [accountId, setAccount] = useState<string | null | undefined>();
  const [withdrawAddress, setWithdrawAddress] = useState<string | null | undefined>();
  const [disabled, setDisabled] = useState(false);
  const [addressErrMsg, setAddressErrMsg] = useState('');
  const [withdrawInfo, setWithdrawInfo] = useState({
    minimalWithdrawal: 0,
    serviceFee: 0
  })
  const withdrawLimitResult = useCall(api.rpc.xgatewaycommon.withdrawalLimit, [1])


  useEffect(() => {
    const minimalWithdrawal = (withdrawLimitResult as any)?.toJSON()?.minimalWithdrawal
    const serviceFee = (withdrawLimitResult as any)?.toJSON()?.fee

    serviceFee && minimalWithdrawal && setWithdrawInfo(withdrawInfo => ({
      serviceFee: toPrecision(serviceFee, 8, false) as number,
      minimalWithdrawal: toPrecision(minimalWithdrawal, 8, false) as number
    }))
  }, [withdrawLimitResult])

  useEffect(() => {
    if (!withdrawAddress) {
      setAddressErrMsg('必填');
      setDisabled(true);
    }
      // else if (!['1', '3'].includes(withdrawAddress[0])) {
      //   setAddressErrMsg('提现的BTC地址必须以1或3开头');
      //   setDisabled(true);
    // }
    else {
      setAddressErrMsg('');
      setDisabled(false);
    }
  }, [withdrawAddress]);

  return (
    <Wrapper
      header={t('X-BTC Withdrawals')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={account}
              help={t('Select the account you want to withdrawal')}
              isDisabled={!!account}
              label={t('Withdrawal Account')}
              labelExtra={
                <div>
                 <span className="web3ComingChat">{t('You can withdrawal')}</span>  {Number(btc) / Math.pow(10, 8)} X-BTC
                </div>
              }
              onChange={setAccount}
              type='account'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('Minimum withdrawal amount is')} {withdrawInfo.minimalWithdrawal} XBTC</p>
          </Modal.Column>
          {/* <Modal.Column>
            <p>{t('Withdrawal Account')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns className='mob'>
          <Modal.Column>
            <Input
              help={t('the actual account you wish to withdraw')}
              label={t('BTC withdraw address')}
              onChange={setWithdrawAddress}
            />
          </Modal.Column>
          <Modal.Column className='mobs'>
            {/* <p>{t('BTC withdraw address')}</p> */}
            <span style={{display: (disabled === true) ? "block" : "none"}}>{t('Required')}</span>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputXBTCBalance
              autoFocus
              label={t('The number of withdrawals')}
              onChange={setAmount}
            />
          </Modal.Column>
          <Modal.Column className='mobs'>
            <p>{t('Service Fee')} {withdrawInfo.serviceFee} XBTC</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              autoFocus
              help={t('Remark')}
              label={t('Remark')}
              onChange={setMemo}
            />
          </Modal.Column>
          {/* <Modal.Column>
            <p>{t('Remark')}</p>
          </Modal.Column> */}
        </Modal.Columns>

      </Modal.Content>

      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='sign-in-alt'
          label={t('Withdrawals')}
          onStart={onClose}
          params={['1', amount, withdrawAddress, memo ? memo.trim() : '']}
          tx='xGatewayCommon.withdraw'
          isDisabled={disabled}
          onSuccess={() => {
            setN(Math.random());
          }}
        />
      </Modal.Actions>
    </Wrapper>
  );
}

export default React.memo(Withdraw);
