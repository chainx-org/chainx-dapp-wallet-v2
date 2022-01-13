import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Empty from '../../Empty/index';
import MiniLoading from '../../MiniLoading/index';
import Line from './Line';
import { useIsMounted } from '../../hooks';
import { useTranslation } from '@polkadot/react-components/translate';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { InfiniteScroll, Loading } from 'antd-mobile'
import { sleep } from 'antd-mobile/es/utils/sleep'
import {useApi} from '@polkadot/react-hooks';
import axios from 'axios';
import { Transfer } from '../../../../useXsbtcTransfer';
import getApiUrl from '../../../../../../apps/src/initSettings';

const Wrapper = styled.div`
  & > div.empty {
    margin-top: 120px;
  }

  .line {
    cursor: pointer;
    position: relative;
    &:not(:first-of-type) {
      border-top: 1px solid #eee;
    }
    padding: 10px 16px;
    header,
    main {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0;
    }
    header {
      opacity: 0.32;
      font-size: 12px;
      color: #000000;
      letter-spacing: 0.2px;
      line-height: 16px;
    }

    main {
      margin-top: 4px;
      opacity: 0.72;
      font-size: 12px;
      font-weight: 500;
      color: #000000;
      letter-spacing: 0.2px;
      line-height: 16px;
    }
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

let count = 0;
export default function ({transfers}): React.ReactElement {
  const { t } = useTranslation();
  const apiUrl = getApiUrl()
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true)
  const [data, setData] = useState<Transfer[]>([])
  const mounted = useIsMounted();
  const [all, setAll] = useState<number>()
  const { currentAccount } = useContext(AccountContext);
  
  useEffect(() => {
    setLoading(true);
  }, [mounted]);

  useEffect(() => {
    if (mounted.current) {
      setLoading(false);
    }
  });

  const transfersElement = transfers?.map((transfer, index) => {
    return <Line key={index} transfer={transfer} />;
  });

  if (loading) {
    return (
      <LoadingWrapper>
        <MiniLoading />
      </LoadingWrapper>
    );
  }
  async function mockRequest() {
    if (all < 20) {
      return []
    }
    await sleep(2000)
    count++
    let res: any;
    if (apiUrl.includes('mainnet')) {
      res = await axios.get(`https://multiscan-api.coming.chat/sherpax/palletAssets/${currentAccount}/transfers?asset_id=1&page=${count}&page_size=20`);
    } else {
      res = await axios.get(`https://multiscan-api-pre.coming.chat/sherpax/palletAssets/${currentAccount}/transfers?asset_id=1&page=${count}&page_size=20`);
    }
    return res.data.items
  }
  async function loadMore() {
    const append = await mockRequest()
    setData(val => [...val, ...append])
    setHasMore(append.length > 20)
    setAll(append.length)
  }
  const InfiniteScrollContent = ({hasMore}: {hasMore?: boolean}) => {
    return (
      <>
        {hasMore ? (
          <div style={{color: '#b1b1b1', fontSize: '18px'}}>
            <Loading color="currentColor" />
          </div>
        ) : (
          <></>
        )}
      </>
    )
  }
  return (
    <Wrapper>
      {(transfers || []).length > 0 ? (
        <>
          {transfersElement}
          {
            transfers && transfers.length > 19 ? 
            <>
            {data?.map((transfer, index) => {
              return <Line key={index} transfer={transfer} />;
            })}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
              <InfiniteScrollContent hasMore={hasMore} />
            </InfiniteScroll> </>: <></>   
          }
        </>
      ) : (
          <div className='empty'>
            <Empty text={t('No transfer record')} />
          </div>
        )}
    </Wrapper>
  );
}
