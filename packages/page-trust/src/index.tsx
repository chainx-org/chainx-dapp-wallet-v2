import type { AppProps as Props, ThemeProps } from '@polkadot/react-components/src/types';
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useApi } from "@polkadot/react-hooks";
import { AccountLoading } from '@polkadot/react-components-chainx';
import { Table, Expander, AddressMini, Input, Modal, InputAddressMulti, QrNetworkSpecs,AddressSmall } from '@polkadot/react-components';
import { useTranslation } from '../../page-accounts-chainx/src/translate';
import { TransactionData } from '@polkadot/ui-settings';
import { FormatBalance } from '@polkadot/react-query';



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
              // let feeAmount: number = Number((refee[0].fee / Math.pow(10, 8)).toFixed(3))
              let total = Number(Number((Number(arrayApply[i].balance))/ Math.pow(10, 8)).toFixed(4))
              standardData.push({ address: arrayApply[i].addr, amount: String(total) })
            }
          }
        }
        let totalLarge = 0;
        for (let i = 0; i < standardData.length; i++) {
          totalLarge += Number(standardData[i].amount)
          let totall = Number(totalLarge).toFixed(4)
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
      <div className='bar'>
        <button className='myButton' onClick={refreshData}>Reload</button>
        <button className='myButton' onClick={() => setVisible(true)}>Send</button>
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
                  <InputAddressMulti
                    available={addressValue}
                    availableLabel={t<string>('Applying list')}
                    onChange={getAccount}
                    maxCount={10}
                    valueLabel={t<string>('Ready to send a withdrawal request')}
                  />
                  <Modal.Column>
                    <Input label={t('Total')} value={totalAmount} />

                  </Modal.Column>

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
            <Modal.Actions onCancel={() => setVisible(false)} style={{ background: '#f5f3f1' }}>
            </Modal.Actions>
          </Modal>
          )}
      </div>
      <div className='content'>
        <Table>
          <tr>
            <td style={{border: 0 }}><h2>applying list</h2></td>
            <td className='same' >amount</td>
            <td className='same'>destination</td>
            <td className='same'style={{ border: 0 }}>block</td>
            <td className='same'>id</td>
          </tr>

          {transList && transList.map((item: any) => {
            return (
              <tr className={className} key={item.id}>
                <td className='address'>
                  <AddressSmall value={item.applicant} />
                </td>
                <td className='textCenter' style={{paddingLeft:'10px'}}>
                  {/* <Expander summary={String((Number((Number(item.balance)+Number(fee)) / Math.pow(10, 8)).toFixed(4)) +' '+ 'sBTC')} > */}
                  <Expander summary={<FormatBalance withCurrency={false} label={(Number((Number(item.balance)+Number(fee)) / Math.pow(10, 8)).toFixed(4))} value={'sBTC'} /> }>
                    <AddressMini
                      children={
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ paddingLeft: '35px' }}>
                           <span className='same'>fee</span>&nbsp;
                            {fee && <span className='content'>
                              {/* {String(Number(Number(fee) / Math.pow(10, 8)).toFixed(3) + ' '+'sBTC')} */}
                              <FormatBalance withCurrency={false} label={Number(Number(fee)/Math.pow(10, 8)).toFixed(3)} value={'sBTC'} />
                            </span>}
                          </div>
                          <div style={{ marginLeft: '-13px' }}>
                          <span className='same'>withdrawal</span>&nbsp;
                            <span className='content'>
                              <FormatBalance withCurrency={false} label={Number(Number(item.balance)/Math.pow(10, 8)).toFixed(3)} value={'sBTC'} />
                              {/* {String(Number(Number(item.balance ) / Math.pow(10, 8)).toFixed(3) + ' '+'sBTC')} */}
                            </span>
                          </div>
                        </div>}
                    />
                  </Expander>
                </td>
                <td className='textCenter'>{item.addr}</td>
                <td className='textCenter'>{item.height}</td>
                <td className='textCenter'>{item.id}</td>
              </tr>
            )
          })}
        </Table>
      </div>
      <div className='content'>
        <Table>
          <tr>
            <td style={{ border: 0 }}><h2>processing list</h2></td>
            <td className='same'>amount</td>
            <td className='same'>destination</td>
            <td className='same'>block</td>
            <td className='same'>id</td>
          </tr>
          {transactionList && transactionList.map((item: any) => {
            return (
              <tr className={className} key={item.id}>
              <td className='address'>
                <AddressSmall value={item.applicant} />
                {/* <Identicon className="imgIcon" value={item.applicant} size={28} theme="polkadot" style={{ margin: '0 10px', verticalAlign: 'middle' }} />
                <span style={{ letterSpacing: '0.13em' }}>{item.applicant}</span> */}   
              </td>
              <td className='textCenter' style={{paddingLeft:'10px'}}>
                {/* <Expander summary={String((Number((Number(item.balance)+Number(fee)) / Math.pow(10, 8)).toFixed(4)) +' '+ 'sBTC')} > */}
                <Expander summary={<FormatBalance withCurrency={false} label={(Number((Number(item.balance)+Number(fee)) / Math.pow(10, 8)).toFixed(4))} value={'sBTC'} /> }>
                  <AddressMini
                    children={
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ paddingLeft: '35px' }}>
                         <span className='same'>fee</span>&nbsp;
                          {fee && <span className='content'>
                            {/* {String(Number(Number(fee) / Math.pow(10, 8)).toFixed(3) + ' '+'sBTC')} */}
                            <FormatBalance withCurrency={false} label={Number(Number(fee)/Math.pow(10, 8)).toFixed(3)} value={'sBTC'} />
                          </span>}
                        </div>
                        <div style={{ marginLeft: '-13px' }}>
                        <span className='same'>withdrawal</span>&nbsp;
                          <span className='content'>
                            <FormatBalance withCurrency={false} label={Number(Number(item.balance)/Math.pow(10, 8)).toFixed(3)} value={'sBTC'} />
                            {/* {String(Number(Number(item.balance ) / Math.pow(10, 8)).toFixed(3) + ' '+'sBTC')} */}
                          </span>
                        </div>
                      </div>}
                  />
                </Expander>
              </td>
              <td className='textCenter'>{item.addr}</td>
              <td className='textCenter'>{item.height}</td>
              <td className='textCenter'>{item.id}</td>
            </tr>
            )
          })}
        </Table>
      </div>
      {loading && <AccountLoading />}

    </main>
  );
}

export default React.memo(styled(transactionList)(({ theme }: ThemeProps) => `
.bar{
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
    margin:20px 30px 20px 0px;
  }
  .myButton:hover {
    background-color:#f88e0d;
  }
  .myButton:active {
    position:relative;
    top:1px;
  }
}
.content{
  min-weight:1200px;
  width:100%;
  height:100%;
  text-align:center;
  overflow-x:auto;
  Table{
    width:96.5%;
    line-height:1.44rem;
    border-radius:2px;
    background:#fff;
    margin-bottom:10px;
    margin:0 auto;
    z-index:0;
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
      .textCenter{
        text-align:center;
        border:0;
      }
  }
}
`));
