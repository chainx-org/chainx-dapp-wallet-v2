import type { AppProps as Props, ThemeProps } from '@polkadot/react-components/src/types';
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useApi } from "@polkadot/react-hooks";
import { AccountLoading } from '@polkadot/react-components-chainx';
import Identicon from '@polkadot/react-identicon';
import { Table, Expander, AddressMini, Input, Modal, InputAddressMulti, QrNetworkSpecs } from '@polkadot/react-components';
import { useTranslation } from '../../page-accounts-chainx/src/translate';
import { TransactionData } from '@polkadot/ui-settings';


function transactionList({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const [transList, setTransList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [loading, setLoading] = useState(false)
  const [fee, setFee] = useState([]);
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false)
  const [arrayApply, setArrayApply] = useState([])
  const [refee, setRefee] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0)
  const [addressValue, setAddressValue] = useState<string[]>([]);

  const initialState = [{
    address: '',
    amount: '',
  }];

  const [qrData, setQrData] = useState<TransactionData>(initialState);

  async function getData(): Promise<any> {
    setLoading(true)
    setVisible(false)
    if (isApiReady) {
      setTransList([])
      const resData = await api.rpc.xgatewayrecords.withdrawalList()
      let resultList = resData.toJSON()
      let result = Object.keys(resData.toJSON()).reduce((pre, cur) => {
        resultList[cur].id = parseInt(cur)
        return pre.concat(resultList[cur])
      }, [])

      let applying = result.filter(item => item.state == "Applying");
      let processing = result.filter(item => item.state == "Processing");
      setTransList([...applying])
      setTransactionList([...processing])
      const res = await api.rpc.xgatewaycommon.withdrawalLimit(1)
      let resFee = res.toJSON()
      setFee(resFee.fee)
      refee.push({ ...resFee })

      setArrayApply(applying)

      let resultString = []
      applying.map(item => resultString.push(item.applicant))
      setAddressValue(resultString)
      setLoading(false)
    }
  }

  const getAccount = useCallback(
    (value: string) => {
      if (value == '') {
        setTotalAmount(Number(value))
        setQrData(initialState)
      } else {
        let standardData = []
        for (let index = 0; index < value.length; index++) {
          for (let i = 0; i < arrayApply.length; i++) {
            if (value[index] === arrayApply[i].applicant) {
              let total = Number((arrayApply[i].balance / Math.pow(10, 8)).toFixed(4))
              standardData.push({ address: arrayApply[i].addr, amount: String(total) })
            }
          }
        }
        let totalLarge = 0;
        for (let i = 0; i < standardData.length; i++) {
          totalLarge += Number(standardData[i].amount)
          let feeAmount: number = Number((refee[0].fee / Math.pow(10, 8)).toFixed(3))
          let totall = Number(totalLarge + standardData.length * feeAmount).toFixed(4)
          setTotalAmount(Number(totall))
        }
        setQrData(standardData)
      }
    },
    [arrayApply],
  );

  useEffect((): void => {
    getData().then(res => {
    });
  }, [isApiReady]);

  const refreshData = () => {
    getData()
  }

  return (
    <main className={`staking--App ${className}`}>
      <div className='contentmain'>
        <div className='bar'>
          <button className='myButton' onClick={refreshData}>Reload</button>
          <button className='myButton' onClick={() => setVisible(true)}>send</button>
          {visible &&
            (<Modal
              className='app--accounts-Modal'
              header={t<string>('please select the withdrawal request')}
              size='large'
            >
              <Modal.Content>
                <Modal.Columns>
                  <Modal.Column>
                    <InputAddressMulti
                      available={addressValue}
                      availableLabel={t<string>('applying list')}
                      onChange={getAccount}
                      maxCount={10}
                      valueLabel={t<string>('Ready to send a withdrawal request')}
                    />
                    <Input
                      label={t('Total amount')}
                      value={totalAmount}
                    />
                  </Modal.Column>
                  <Modal.Column>
                    <p>The official recommendation is to select no more than 10 request</p>
                    <QrNetworkSpecs style={{ width: '200px', marginLeft: '50px', padding: '10px' }}
                      className='settings--networkSpecs-qr'
                      networkSpecs={qrData}
                    />
                    <p>Please scan this QR code using the Coming app</p>
                  </Modal.Column>
                </Modal.Columns>
                <Modal.Columns>
                </Modal.Columns>
                <Modal.Columns>
                </Modal.Columns>
              </Modal.Content>
              <Modal.Actions onCancel={() => setVisible(false)}>
                {/* <Button className={""} icon="sign-in-alt" label={t("Coming App")} /> */}
              </Modal.Actions>
            </Modal>
            )}
        </div>
        <div className='content'>
          <Table>
            <tr>
              <td style={{ width: '747px',border:0 }}><h2>applying list</h2></td>
              <td className='same' style={{ width: '260px' }}>amount</td>
              <td className='same' style={{ width: '417px' }}>destination</td>
              <td className='same' style={{ width: '110px',border:0}}>block</td>
            </tr>
          
            {transList && transList.map((item: any) => {
              return (
                <tr className={className} key={item.id}>
                  <td className='address' style={{border:0}}>
                    <span>{item.id}</span>
                    <Identicon className="imgIcon" value={item.applicant} size={28} theme="polkadot" style={{ margin: '0 10px', verticalAlign: 'middle' }} />
                    <code style={{ letterSpacing: '0.13em', fontSize: '16px' }}><span>{item.applicant}</span></code>
                  </td>
                  <td style={{ textAlign: 'center',border:0}}>
                    <Expander summary={String(Number(item.balance / Math.pow(10, 8)).toFixed(4) + 'sBTC')} >
                      {/* <Expander summary={String((toPrecision(item.balance,8).toFixed(4)) + 'sBTC')}> */}
                      <AddressMini
                        children={
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ paddingLeft: '30px' }}>
                              fee  &nbsp;
                              {fee && <span className='content'>{String(Number(Number(fee) / Math.pow(10, 8)).toFixed(3) + 'sBTC')}</span>}
                            </div>
                            <div style={{ marginLeft: '-30px' }}>
                              real amount &nbsp;
                              {fee && <span className='content'>{String(Number(Number(fee) / Math.pow(10, 8)).toFixed(3) + 'sBTC')}</span>}
                            </div>
                          </div>}
                      />
                    </Expander>
                  </td>
                  <td style={{border:0}}>{item.addr}</td>
                  <td style={{border:0}}>{item.height}</td>
                </tr>
              )
            })}
          </Table>
        </div>
        <div className='content' style={{ margin: '30px 0px 0px 0px' }}>
          <Table >
            <tr>
              <td style={{ width: '747px' ,border:0}}><h2>processing list</h2></td>
              <td className='same' style={{ width: '260px' ,border:0}}>amount</td>
              <td className='same' style={{ width: '417px',border:0 }}>destination</td>
              <td className='same' style={{ width: '110px' ,border:0}}>block</td>
            </tr>
            {transactionList && transactionList.map((item: any) => {
              return (
                <tr className={className} key={item.id}>
                  <td className='address'>
                    <span>{item.id}</span>
                    <Identicon className="imgIcon" value={item.applicant} size={28} theme="polkadot" style={{ margin: '0 10px', verticalAlign: 'middle' }} />
                    <code style={{ letterSpacing: '0.13em', fontSize: '16px'}}><span style={{opacity:0.6}}>{item.applicant}</span></code>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Expander summary={String(Number(item.balance / Math.pow(10, 8)).toFixed(4) + 'sBTC')} >
                      <AddressMini
                        children={
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ paddingLeft: '30px' }}>
                              fee  &nbsp;
                              {fee && <span className='content'>{String(Number(Number(fee) / Math.pow(10, 8)).toFixed(3) + 'sBTC')}</span>}
                            </div>
                            <div style={{ marginLeft: '-30px' }}>
                              real amount &nbsp;
                              {fee && <span className='content'>{String(Number(Number(fee) / Math.pow(10, 8)).toFixed(3) + 'sBTC')}</span>}
                            </div>
                          </div>}
                      />
                    </Expander>
                  </td>
                  <td >{item.addr}</td>
                  <td >{item.height}</td>
                </tr>
              )
            })}
          </Table>
        </div>
        {loading && <AccountLoading />}
      </div>
    </main>
  );
}

export default React.memo(styled(transactionList)(({ theme }: ThemeProps) => `
.bar{
  margin-left:2.5rem;
  padding:1rem 0;
  .myButton {
    background-color:#F7941A;
    border-radius:0.25rem;
    border:1px solid #F7941A;
    display:inline-block;
    cursor:pointer;
    color:#ffffff;
    font-family:Arial;
    font-size:18px;
    padding:8px 24px;
    text-decoration:none;
    float:right;
    margin:10px 30px 20px 0px;
  }
  .myButton:hover {
    background-color:#f88e0d;
  }
  .myButton:active {
    position:relative;
    top:1px;
  }
}
.contentmain{
  width:97.5%;
  min-height:30rem;
  background:#fff;
  margin:0 auto;
  border-radius:10px;
  .bar{
    margin:30px 0px 0px 0px;
  }
 
.content{
  min-weight:1200px;
  width:100%;
  height:100%;
  text-align:center;
  overflow-x:auto;
  Table{
    width:97.5%;
    line-height:1.44rem;
    border-radius:2px;
    background:#fff;
    margin-bottom:10px;
    margin:0 auto;
      tr{
        height:1.4285rem;
        line-height:1.4285rem;
        .address{
           width:747px;
          .imgIcon{
            margin:0 10px;
            vertical-align:middle;
          }
        }
      }
      .same{
        text-align:center;
        color:#rgb(78, 78, 78);
        opacity: 0.6;
        font:400 1em -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"
      }
    }
  }
}
`));
