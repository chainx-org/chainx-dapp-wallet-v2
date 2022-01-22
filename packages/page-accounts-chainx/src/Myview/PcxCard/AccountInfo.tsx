import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import {useAccountInfo, useAccounts, useApi} from '@polkadot/react-hooks';
import {useTranslation} from '@polkadot/app-accounts/translate';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import {AssetsInfo} from '@polkadot/react-hooks-chainx/types';
import {useReadChainStorage} from '@polkadot/react-hooks-chainx';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  // min-height: 72px;
  @media screen and (max-width:540px){
    justify-content: center;
    text-align: left;
  }
`;

const Title = styled.h5`
  margin: 0;
  opacity: 0.72;
  font-size: 18px;
  color: #000000;
  letter-spacing: 0.1px;
  line-height: 28px;
`;

const BaseRow = styled.p`
  margin: 0;
  opacity: 0.56;
  color: #000000;
`;

const Address = styled(BaseRow)`
  font-size: 14px;
  line-height: 20px;
  @media screen and (max-width:767px) {
    display: none;
  }
`;

export default function (): React.ReactElement {
  const { api, isApiReady } = useApi();
  const {t} = useTranslation();
  const {currentAccount} = useContext(AccountContext);
  const {name} = useAccountInfo(currentAccount);
  const [identify, setIdentify] = useState<string>('')

  async function getIdentity(account: string): Promise<any> {
    const getStakingNode = await api.rpc.xstaking.getValidators();
    const getTrustNode = await api.rpc.xgatewaycommon.bitcoinTrusteeSessionInfo()
    const stakingNodeList = JSON.parse(getStakingNode);
    const trusteeList = JSON.parse(getTrustNode)
    const trustNodeList = trusteeList.trusteeList
    const validateNode = stakingNodeList.filter((node: any) => account === node.account )
    const trustNode = trustNodeList.filter((node: string) => account === node)
    if(validateNode.length > 0 && trustNode.length > 0){
      setIdentify(t('The node of validate and trust'))
    }else if(validateNode.length > 0){
      setIdentify(t('The node of validate'))
    }else if(trustNode.length > 0){
      setIdentify(t('The node of trust'))
    } else {
      setIdentify('')
    }
  }

  useEffect(() => {
    getIdentity(currentAccount)
  }, [currentAccount, isApiReady]);

  return (
    <Wrapper>
      <Title>{ isApiReady? name: '-'}</Title>
      <Address>{currentAccount? currentAccount : '-'}</Address>
      <div>{identify || ''}</div>
    </Wrapper>
  );
}
