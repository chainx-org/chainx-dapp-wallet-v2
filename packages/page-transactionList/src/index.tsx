import type {AppProps as Props, ThemeProps} from '@polkadot/react-components/types';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import sbtcIcon from './assets/sbtc.png';
import processIcon from './assets/process.png'
import {useApi} from "@polkadot/react-hooks";
import CopyText from "./CopyText";
import BigNumber from 'bignumber.js'
import { toPrecision } from '../../page-accounts-chainx/src/Myview/toPrecision';
import FinalWithdrawal from './components/FinalWithdrawal';

function transactionList({basePath, className = ''}: Props): React.ReactElement<Props> {
  const {api, isApiReady} = useApi();
  const [transList, setTransList] = useState([]);
  const [fee, setFee] = useState();

  async function getData(): Promise<any> {
    if (isApiReady) {
      const result = await api.rpc.xgatewayrecords.withdrawalList()
      const res = await api.rpc.xgatewaycommon.withdrawalLimit(1)
      let resultList = Object.values(result.toJSON())
      let resFee = res.toJSON()
      setTransList(resultList)
      setFee(resFee.fee)
      console.log('fee',resFee,result.toJSON())
    }
  }

  useEffect((): void => {
    getData();
  }, [isApiReady]);
  const refreshData = () => {
    getData()
  }
  return (
    <main className={`staking--App ${className}`}>
      <div className='bar'>
        <span>Redeem Request</span>
        <button className='myButton' onClick={refreshData}>Refresh</button>
      </div>
      <div className='container'>
        {transList && transList.map((item: any) => {
          return (
            <div className='box' key={item.block}>
              <div className='firstLine'>
                <CopyText text={item.applicant}>
                  <span className='title' style={{marginRight:'10px'}}>User</span>
                  {item.applicant
                    ?.substring(0, 7)
                    .concat('...')
                    .concat(item.applicant?.substring(item.applicant.length - 5))}
                </CopyText>
                <div className='imgContent'>
                  <img src={sbtcIcon} alt="" style={{width: '18px'}}/>
                  {/*{item.asset_id}*/}
                  <span className='content' style={{color: '#A535A5'}}>sBTC</span>
                </div>
              </div>
              <div className='title'>
                Amount
                <span className='content'>{toPrecision(item.balance,8)}</span>
              </div>
              <div className='title'>
                Fee
                { fee && <span className='content'>{toPrecision(fee,8)}</span> }
              </div>
              <div className='title'>
                <FinalWithdrawal
                  asset={('Final_Withdrawal')}
                  balance={item.balance}
                  free={fee}
                  precision={8}
                />
              </div>
              <CopyText text={item.addr}>
                <span className='title' style={{marginRight:'10px'}}>Address</span>
                {item.addr
                  ?.substring(0, 7)
                  .concat('...')
                  .concat(item.addr?.substring(item.addr.length - 5))}
              </CopyText>
              <div className='firstLine'>
                <div>
                  <span className='title'>Block</span>
                  <span className='content'>{item.height}</span>
                </div>
                <div className='imgContent'>
                  <img src={processIcon} alt="" style={{width: '18px'}}/>
                  <span className='content'>{item.state}</span>
                </div>
              </div>
            </div>)
        })}
      </div>
    </main>
  );
}


export default React.memo(styled(transactionList)(({theme}: ThemeProps) => `
.bar{
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  padding:1rem 0;
  >span{
    display:inline-block;
    font-weight: 600;
    font-size: 18px;
    line-height: 40px;
  }
  .myButton {
    background-color:#F7941A;
    border-radius:10px;
    border:1px solid #F7941A;
    display:inline-block;
    cursor:pointer;
    color:#ffffff;
    font-family:Arial;
    font-size:18px;
    padding:8px 24px;
    text-decoration:none;
  }
  .myButton:hover {
    background-color:#f88e0d;
  }
  .myButton:active {
    position:relative;
    top:1px;
  }
}
.container{
  display: grid;
  grid-template-columns: repeat(auto-fill, 24.7%);
  grid-gap: 5px;
  @media screen and (max-width: 1023px){
    grid-direction:column;
    grid-template-columns: repeat(auto-fill, 100%);
  }
  .box{
    border: 1px solid #dce0e2;
    border-radius: 10px;
    padding: 16px;
    background: #fff;
    height: fit-content;
    .firstLine{
      display:flex;
      flex-direction:row;
      justify-content:space-between;
    }
    .title{
      color:#F7941A;
      font-weight:500;
      font-size:16px;
    }
    .content{
      padding-left:10px;
      color:#4e4e4e;
      font-weight:400;
      font-size:14px;
    }
    .imgContent{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
`));
