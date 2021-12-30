import React, { useContext, useState }  from 'react';
import Empty from '../../Empty';
import Wrapper from './Wrapper';
import Line from './Line';
import { useTranslation } from '@polkadot/app-accounts/translate';
import {Deposit} from '@polkadot/app-accounts-chainx/useRecords';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { InfiniteScroll, Loading } from 'antd-mobile'
import { sleep } from 'antd-mobile/es/utils/sleep'
import {useApi} from '@polkadot/react-hooks';
import axios from 'axios';
interface Props{
  deposits: Deposit[];
}

let count = 0;
export default function ({deposits}: Props): React.ReactElement<Props> {

  const { t } = useTranslation();
  const {api} = useApi();
  const [hasMore, setHasMore] = useState(true)
  const [data, setData] = useState<Deposit[]>([])
  const [all, setAll] = useState<number>()
  const { currentAccount } = useContext(AccountContext);
  const depositsElement = (
    <ul>
      {(deposits || []).map((deposit, index) => {
        return <Line deposit={deposit} key={index} />;
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
      res = await axios.get(`https://multiscan-api-pre.coming.chat/sherpax/xgateway/${currentAccount}/deposits?page=${count}&page_size=20`);
    } else {
      res = await axios.get(`https://multiscan-api.coming.chat/sherpax/xgateway/${currentAccount}/deposits?page=${count}&page_size=20`);
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
      {(deposits || []).length > 0 ? (
        <>
          {depositsElement}
          {
            deposits && deposits.length > 19 ? 
            <>
            {(data || []).map((deposit, index) => {
              return <Line deposit={deposit} key={index} />;
            })}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
              <InfiniteScrollContent hasMore={hasMore} />
            </InfiniteScroll> </>: <></>   
          }
        </>
      ) : (
          <div>
            <Empty text={t('No top-up record')} />
          </div>
        )}
    </Wrapper>
  );
}
