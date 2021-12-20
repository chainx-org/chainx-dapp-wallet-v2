import React, {useState} from 'react';
import styled from 'styled-components';
import TransferRecords from './TransferRecords';
import { useTranslation } from '@polkadot/app-accounts/translate';
import Records from './CrossChainRecord'
import AllAccounts from './Contacts';

const Wrapper = styled.section`
  border: 1px solid #dce0e2;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
  height: 200px;
  @media screen and (max-width:1023px){
    padding: 36px 16px !important;
  }
`;

const Wrappers = styled.div`
  height: 570px;
  > ul {
    display: flex;
    justify-content: space-around;
    & > li {
      font-size: 14px;
      letter-spacing: 0.12px;
      line-height: 20px;
      cursor: pointer;
      padding-bottom: 13px;
      color: rgba(0,0,0,0.4);
      font-weight: 600;

      > a{
        opacity: 1;
      }

      &:hover, &.active{
        color: rgba(0,0,0,0.8);
      }

      &.active {
        border-bottom: 3px solid #ED2B89;
      }

      &:not(:first-of-type) {
        margin-left: 24px;
      }
    }
  }

  & > main {
    flex: 1;
    margin: 0 -16px;
    border-top: 1px solid #eee;
    height: 100%;
    overflow-y: auto;
  }
`;

export default function (): React.ReactElement {
  const [recordType, setRecordType] = useState(1);
  const { t } = useTranslation();


  return (
    <Wrapper>
      <Wrappers>
        <ul>
          <li
            className={recordType === 1 ? 'active' : ''}
            onClick={() => setRecordType(1)}
          >
            {t('Transfers')}
          </li>
          <li
            className={recordType === 2 ? 'active' : ''}
            onClick={() => setRecordType(2)}
          >
            {t('Records')}
          </li>
          <li
            className={recordType === 3 ? 'active' : ''}
            onClick={() => setRecordType(3)}
          >
            {t('Contacts')}
          </li>
        </ul>
        <main>
          {recordType === 1 ? <TransferRecords /> : null}
          {recordType === 2 ? <Records /> : null}
          {recordType === 3 ? <AllAccounts /> : null}
        </main>
      </Wrappers>
    </Wrapper>
  );
}
