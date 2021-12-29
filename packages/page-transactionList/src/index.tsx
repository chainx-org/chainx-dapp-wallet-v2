import type {AppProps as Props, ThemeProps} from '@polkadot/react-components/types';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import sbtcIcon from './assets/sbtc.png';
import processIcon from './assets/process.png'
import {useApi} from "@polkadot/react-hooks";
import CopyText from "./CopyText";
import {AccountLoading} from '@polkadot/react-components-chainx';
import { toPrecision } from '../../page-accounts-chainx/src/Myview/toPrecision';
import FinalWithdrawal from './components/FinalWithdrawal';

function transactionList({basePath, className = ''}: Props): React.ReactElement<Props> {
  const {api, isApiReady} = useApi();
  const [transList, setTransList] = useState([]);
  const [loading, setLoading] = useState(false)
  const [fee, setFee] = useState();

  async function getData(): Promise<any> {
    setLoading(true)
    if (isApiReady) {
      setTransList([])
      const resData = await api.rpc.xgatewayrecords.withdrawalList()
      let resultList = resData.toJSON()
      let result = Object.keys(resData.toJSON()).reduce((pre,cur)=>{
        resultList[cur].id = parseInt(cur)
        return pre.concat(resultList[cur])
      },[])
      setTransList(result)
      const res = await api.rpc.xgatewaycommon.withdrawalLimit(1)
      let resFee = res.toJSON()
      setFee(resFee.fee)
      setLoading(false)
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
              <div className='title'>
                Id
                <span className='content'>{item.id}</span>
              </div>
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
                  <span className='content'>sBTC</span>
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
                  <div className='cricle'></div>
                  <span className='content'>{item.state}</span>
                </div>
              </div>
            </div>)
        })}
      </div>
      {loading && <AccountLoading/>}
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
    padding: 14px;
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
       .cricle{
        display: inline-block;
        align-items: center;
        justify-content: center;
        width: 10px;
        height: 10px;
        background-color: #A535A5;
        border-radius: 50%;
      }
      .content{
        color:#A535A5;
      }
    }
  }
}
`));
