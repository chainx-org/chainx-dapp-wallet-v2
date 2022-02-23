// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import BN from 'bn.js';
import React, {Dispatch, useEffect, useState} from 'react';
import {Input, InputAddress, Modal, TxButton} from '@polkadot/react-components';
import InputSBTCBalance from '@polkadot/react-components-chainx/InputSBTCBalance';
import {useApi} from "@polkadot/react-hooks";
import {useTranslation} from '../../translate';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';

interface Props {
  onClose: () => void;
  btc: number | undefined | null;
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
  .finalWithdrawAmount {
    position: relative;
    .final {
      position: absolute;
      left: 40px;
      z-index: 99;
      bottom: 6px;
      background: #fff;
      padding: 4px 10px;
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
  const {api,isApiReady} = useApi();
  const [amount, setAmount] = useState<number | undefined>(0);
  const [memo, setMemo] = useState<string | null | undefined>();
  const [accountId, setAccount] = useState<string | null | undefined>();
  const [withdrawAddress, setWithdrawAddress] = useState<string | null | undefined>();
  const [disabled, setDisabled] = useState(false);
  const [addressErrMsg, setAddressErrMsg] = useState('');
  const [minWithdraw, setMinWithdraw] = useState<number>(0.0075)
  const [minfee, setMinFee] = useState<number>(0.005)
  const [finalWithdraw, setFinalWithdraw] = useState<number>(0)
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

  useEffect((): void => {
    async function getMinWithdraw() {
      const res = await api.rpc.xgatewaycommon.withdrawalLimit(1)
      let resFee = res.toJSON()
      setMinWithdraw(Number(resFee.minimalWithdrawal) / Math.pow(10, 8))
      setMinFee(Number(resFee.fee) / Math.pow(10, 8));
    }
    getMinWithdraw();
  }, [isApiReady]);
  
  useEffect((): void => {
    const WithdrawAmount = new BigNumber(Number(amount) / Math.pow(10, 18))
    setFinalWithdraw(WithdrawAmount.minus(minfee).toNumber())
  }, [amount,minfee]);
  return (
    <Wrapper
      header={t('PCX Withdrawals')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns className='mob'>
          <Modal.Column>
            <InputAddress
              defaultValue={account}
              help={t('Select the account you want to withdrawal')}
              isDisabled={!!account}
              label={t('Withdrawal Account')}
              labelExtra={
                <div>
                  {t('You can withdrawal')} {Number(btc) / Math.pow(10, 8)} PCX
                </div>
              }
              onChange={setAccount}
              type='account'
            />
          </Modal.Column>
          {/* <Modal.Column>
            <p>{t('Withdrawal Account')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns className='mob'>
          <Modal.Column>
            <Input
              help={t('the actual account you wish to withdraw')}
              label={t('PCX withdraw address')}
              onChange={setWithdrawAddress}
            />
          </Modal.Column>
          <Modal.Column className='mobs'>
            {/* <p>{t('PCX withdraw address')}</p> */}
            <span style={{display: (disabled === true) ? "block" : "none"}}>{t('Required')}</span>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns className='mob'>
          <Modal.Column>
            <InputSBTCBalance
              CrossToken={'PCX'}
              autoFocus
              // help={t('The number of withdrawals')}
              label={t('The number of withdrawals')}
              onChange={setAmount}
            />
          </Modal.Column>
          <Modal.Column className='mobs'>
            <p>{t('Minimum withdrawal amount is')} {minWithdraw}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns className='mob'>
          <Modal.Column>
            <div className='finalWithdrawAmount'>
              <div className='final'>{finalWithdraw>0?finalWithdraw:0}</div>
              <InputSBTCBalance
                CrossToken={'PCX'}
                defaultValue={0}
                help={<p>{t<string>('Service Fee')} {minfee} PCX</p>}
                isDisabled
                label={t<string>('You will received')}
              />
            </div>
          </Modal.Column>
          <Modal.Column className='mobs'>
            <p>{t('Service Fee')} {minfee} PCX</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns className='mob'>
          <Modal.Column>
            <Input
              autoFocus
              help={t('Remark')}
              label={t('Remark')}
              onChange={setMemo}
            />
          </Modal.Column>
        </Modal.Columns>

      </Modal.Content>

      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='sign-in-alt'
          label={t('Withdrawals')}
          onStart={onClose}
          params={['1', Number(amount) / Math.pow(10, 10), withdrawAddress, memo ? memo.trim() : '']}
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
