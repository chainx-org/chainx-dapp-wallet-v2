import React, { useContext, useState }  from 'react';
import styled from 'styled-components';
import Empty from '../../Empty';
import Line from './Line';
import { useTranslation } from '@polkadot/app-accounts/translate';
import {Withdrawal} from '@polkadot/app-accounts-chainx/useRecords';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { InfiniteScroll, Loading } from 'antd-mobile'
import { sleep } from 'antd-mobile/es/utils/sleep'
import {useApi} from '@polkadot/react-hooks';
import axios from 'axios';

const Wrapper = styled.div`
  & > div {
    margin-top: 120px;
  }

  & > ul {
    & > li {
      user-select: none;
      position: relative;
      cursor: pointer;
      &:not(:first-of-type) {
        border-top: 1px solid #eee;
      }

      padding: 10px 16px;
      header,
      main {
        display: flex;
        justify-content: space-between;
      }
      header {
        opacity: 0.32;
        font-size: 12px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 16px;
        margin-bottom: 0;
      }

      main {
        margin-top: 4px;
        font-size: 12px;
        font-weight: 500;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 16px;

        span.text {
          opacity: 0.72;
        }

        .state {
          display: flex;
          img {
            margin-left: 8px;
            cursor: pointer;
          }
        }
      }
    }
  }
`;

interface Props{
  withdrawals: Withdrawal[];
}

let count = 0;
export default function ({withdrawals}: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const {api} = useApi();
  const [hasMore, setHasMore] = useState(true)
  const [data, setData] = useState<Withdrawal[]>([])
  const [all, setAll] = useState<number>()
  const { currentAccount } = useContext(AccountContext);
  const withdrawalsElement = (
    <ul>
      {(withdrawals || []).map((withdrawal, index) => {
        return <Line key={index} withdrawal={withdrawal} />;
      })}
    </ul>
  );

  async function mockRequest() {
    if (all < 20) {
      return []
    }
    await sleep(2000)
    count++
    const testOrMain = await api.rpc.system.properties();
    const testOrMainNum = JSON.parse(testOrMain);
    let res: any;
    if (testOrMainNum.ss58Format === 44) {
      res = await axios.get(`https://multiscan-api-pre.coming.chat/sherpax/xgateway/${currentAccount}/withdrawals?page=${count}&page_size=20`);
    } else {
      res = await axios.get(`https://multiscan-api.coming.chat/sherpax/xgateway/${currentAccount}/withdrawals?page=${count}&page_size=20`);
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
      {(withdrawals || []).length > 0 ? (
        <>
          {withdrawalsElement}
          {
            withdrawals && withdrawals.length > 19 ? 
            <>
            {(data || []).map((withdrawal, index) => {
              return <Line key={index} withdrawal={withdrawal} />;
            })}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
              <InfiniteScrollContent hasMore={hasMore} />
            </InfiniteScroll> </>: <></>   
          }
        </>
      ) : (
          <div>
            <Empty text={t('No withdrawal record')} />
          </div>
        )}
    </Wrapper>
  );
}
