import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Empty from '../Empty/index';
import MiniLoading from '../MiniLoading/index';
import Line from './Line';
import { useIsMounted } from '../hooks';
import useTransfer from '../../../useTransfer';
import { useTranslation } from '@polkadot/react-components/translate';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { InfiniteScroll, List } from 'antd-mobile'
import { sleep } from 'antd-mobile/es/utils/sleep'

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

export default function ({transfers}): React.ReactElement {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true)
  const [data, setData] = useState<string[]>([])
  const mounted = useIsMounted();
  // const { currentAccount } = useContext(AccountContext);
  // const transfer = useTransfer(currentAccount);
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
  let count = 0;
  async function mockRequest() {
    if (count >= 5) {
      return []
    }
    await sleep(2000)
    count++
    return ['1']
  }
  async function loadMore() {
    const append = await mockRequest()
    setData(val => [...val, ...append])
    setHasMore(append.length > 0)
  }
  return (
    <Wrapper>
      {(transfers || []).length > 0 ? (
        <>
          {transfersElement}
          {/* <InfiniteScroll loadMore={loadMore} hasMore={hasMore} /> */}
        </>
      ) : (
          <div className='empty'>
            <Empty text={t('No transfer record')} />
          </div>
        )}
    </Wrapper>
  );
}
