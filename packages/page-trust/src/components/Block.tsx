import {Table} from '@polkadot/react-components';
import React, {useRef} from 'react';
import WithdrawList from './WithdrawList';
import styled from 'styled-components';
import {useApi, useCall, useLoadingDelay} from '@polkadot/react-hooks';
import {useTranslation} from '@polkadot/app-accounts/translate';

const Wrapper = styled.div`
  height: 100%;
  flex: 1 1 0;
  padding-top: 16px;
  min-width: 1280px;
  max-width: 1440px;
  margin-left: 80px;
  margin-right: 80px;
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
`;

const Content = styled.div`
    margin-bottom: -1.5rem;
    width: 102.6%;
    border-spacing: 0;
    border-collapse: collapse;
    margin-top: 16px;
    margin-left: -16px;
    margin-right: -16px;
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
  const api = useApi();
  const headerRef = useRef([
    [t('BlockHeight'), 'start', 1],
    [t('identifier'), 'start', 1],
    [t('asset'), 'start'],
    [t('money'), 'start'],
    [t('account address'), 'start'],
    [t('withdrawal address'), 'start'],
    [t('memo'), 'start'],
    [t('state'), 'status']
  ]);
  const withdrawObject: string | undefined = useCall<string>(api.api.rpc.xgatewayrecords.withdrawalListByChain, ['Bitcoin']);
  const withdrawList: withdraw[] = [];

  Object.entries(withdrawObject ? JSON.parse(withdrawObject) : []).forEach(([key, value]) => {
    withdrawList.push({
      id: key,
      ...value
    });
  });
  console.log(withdrawList);
  return (
    <Wrapper>
      <Block>
        <p>{t('Withdrawal list')}</p>
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
