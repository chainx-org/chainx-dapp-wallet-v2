import { Table, Modal, QrNetworkSpecs } from '@polkadot/react-components';
import React, {useMemo, useRef, useState} from 'react';
import WithdrawList from './WithdrawList';
import styled from 'styled-components';
import {useApi, useCall, useLoadingDelay} from '@polkadot/react-hooks';
import {useTranslation} from '@polkadot/app-accounts/translate';
import { TransactionData } from '@polkadot/ui-settings';
import { BigNumber } from 'bignumber.js';

const Wrapper = styled.div`
  height: 100%;
  flex: 1 1 0;
  padding-top: 16px;
  // min-width: 1280px;
  // max-width: 1440px;
  @media screen and (min-width:1024px){
    margin-left: 40px;
    margin-right: 40px;
  }
`;

const Block = styled.div`
  border: 1px solid rgb(220, 224, 226);
  border-radius: 10px;
  padding: 16px;
  background: rgb(255, 255, 255);
  > p{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    font-size: 16px;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .send-button {
      padding: 12px 24px;
      background: #efcb61;
      font-size: 16px;
      font-weight: 500;
      border: none;
      color: white;
      cursor: pointer;
    }
  }
`;

const Content = styled.div`
  margin-bottom: -1.5rem;
  width: 102.6%;
  border-spacing: 0;
  border-collapse: collapse;
  margin-top: 16px;
  margin-left: -16px;
  margin-right: -16px;

  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

interface withdraw {
  id: number,
  assetId: number,
  applicant: string,
  balance: number,
  addr: string,
  ext: string,
  height: number,
  state: string
}

export default function (): React.ReactElement {
  const isLoading = useLoadingDelay();
  const {t} = useTranslation();
  const {api} = useApi();
  const headerRef = useRef([
    [t('BlockHeight'), 'start', 1],
    [t('Identifier'), 'start', 1],
    [t('Asset'), 'start'],
    [t('Money'), 'start'],
    [t('Account Address'), 'start'],
    [t('Withdrawal Address'), 'start'],
    [t('Memo'), 'start'],
    [t('State'), 'status']
  ]);
  const withdrawResult = useCall<string>(api.rpc.xgatewaycommon.withdrawalListWithFeeInfo, [1]);
  const withdrawObject = (withdrawResult as any)?.toJSON() || {}
  const withdrawList: withdraw[] = [];
  const [visible, setVisible] = useState(false)

  Object.keys(withdrawObject).map(i => {
    const [withdrawInfo, withdrawFee] = withdrawObject[i]
    withdrawList.push({
      ...withdrawInfo,
      balance: Number(withdrawInfo.balance) - withdrawFee.fee,
      id: i
    })
  })

  const qrData: TransactionData = useMemo(() => {
    let resultList: { address: string; amount: string }[] = []
    withdrawList
      .filter(i => i.state === "Applying")
      .forEach(i => {
        const index = resultList.findIndex(j => j.address === i.addr)
        if (index === -1) {
          const balance = new BigNumber(i.balance).dividedBy(Math.pow(10, 8)).toString()
          resultList.push({ address: i.addr, amount: balance })
        }
      })
    return resultList.slice(0, 25)
  }, [JSON.stringify(withdrawList)])

  return (
    <Wrapper>

      {visible &&
      (<Modal
          style={{ background: '#f5f3f1' }}
          className='app--accounts-Modal'
          header={t<string>('Please select the withdrawal request')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <QrNetworkSpecs style={{ width: '400px', padding: '10px' }}
                                className='settings--networkSpecs-qr'
                                networkSpecs={qrData}
                />
                <p>Please scan this QR code using the Coming app</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={() => setVisible(false)} style={{ background: '#f5f3f1' }}>
          </Modal.Actions>
        </Modal>
      )}
      <Block>
        <div className={'top'}>
          <p>{t('Withdrawal List')}</p>
          <button className='send-button' onClick={() => setVisible(true)}>Send</button>
        </div>
        <Content>
          <Table
            empty={t<string>('No matches found')}
            header={headerRef.current}
          >
            {
              isLoading ? undefined : withdrawList?.map((
                {addr, applicant, assetId, balance, ext, height, id, state},
                index): React.ReactNode => (
                <WithdrawList
                  addr={addr}
                  applicant={applicant}
                  assetId={id}
                  balance={balance}
                  ext={ext}
                  height={height}
                  id={id}
                  key={id}
                  state={state}/>
              ))
            }
          </Table>
        </Content>
      </Block>
    </Wrapper>
  );
}
