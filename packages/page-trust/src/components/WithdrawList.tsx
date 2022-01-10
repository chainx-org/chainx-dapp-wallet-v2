
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {toPrecision} from '@polkadot/app-accounts-chainx/Myview/toPrecision';
import {useApi} from '@polkadot/react-hooks';

const Wrapper = styled.tr`
  color: inherit;
  display: table-row;
  outline: 0;
  vertical-align: middle;
  > th{
    color: rgba(0, 0, 0, 1);
    line-height: 1;
    border-right: 1px solid #EEEEEE;
    background-color: #FAFAFA;
    display: table-cell;
    padding: 12px 16px;
    text-align: left;
    font-family: Cairo, Arial, sans-serif;
    border-bottom: 1px solid #EEEEEE;
    vertical-align: inherit;
    opacity: 0.72;
    letter-spacing: 0.2px;
    font-size: 12px !important;
    font-weight: 600 !important;
    &:last-child{
      text-align: right;
      border-right: none;
    }
  }
  > td{
    display: table-cell;
    padding: 12px 16px;
    font-size: 12px;
    text-align: left;
    font-family: Cairo, Arial, sans-serif;
    font-weight: 400;
    line-height: 1.5;
    border-bottom: 1px solid #EEEEEE;
    vertical-align: inherit;
    opacity: 0.72;
    letter-spacing: 0.2px;
    &.blue{
      color: rgb(70, 174, 226) !important;
      opacity: 1;
      font-weight: 600 !important;
    }
    &.strong{
      rgb(0,0,0);
      font-weight: 600 !important;
    }
    & > a{
      color: inherit !important;
    }
    &:last-child{
      text-align: right;
      color: rgb(0, 0, 0);
      font-weight: 600 !important;
    }
  }
`;

interface Props {
  id: number,
  assetId: number,
  applicant: string,
  balance: number,
  addr: string,
  ext: string,
  height: number,
  state: string
}

export default function ({ addr, applicant, assetId, balance, ext, height, id, state }: Props): React.ReactElement<Props> {
  const [accountUrl, setAccountUrl] = useState<string>('');
  const [withdrawalUrl, setWithdrawalUr]= useState<string>('');
  const api = useApi();

  useEffect(() => {
    async function judgeMainOrTest(){
      const testOrMain = await api.api.rpc.system.properties();
      const testOrMainNum = JSON.parse(testOrMain);

      if (testOrMainNum.ss58Format === 42) {
        setAccountUrl(`https://scan-pre.chainx.org/accounts/${applicant}`)
        setWithdrawalUr(`https://live.blockcypher.com/btc-testnet/address/${addr}`)
      } else {
        setAccountUrl(`https://scan-v2.chainx.org/accounts/${applicant}`)
        setWithdrawalUr(`https://live.blockcypher.com/btc/address/${addr}`)
      }
    }

    judgeMainOrTest()
  },[])

  return (
    <Wrapper>
      <td>{height}</td>
      <td className='blue'> {assetId}</td>
      <td>BTC</td>
      <td className='strong'>{toPrecision(balance,8)} </td>
      <td><a href={accountUrl} target='_blank'>{applicant} </a></td>
      <td><a href={withdrawalUrl} target='_blank'>{addr} </a></td>
      <td>{ext} </td>
      <td>{state}</td>
    </Wrapper>
  );
}
