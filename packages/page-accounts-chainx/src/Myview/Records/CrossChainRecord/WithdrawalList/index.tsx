import React  from 'react';
import styled from 'styled-components';
import Empty from '../../Empty';
import Line from './Line';
import { useTranslation } from '@polkadot/app-accounts/translate';
import {Withdrawal} from '@polkadot/app-accounts-chainx/useRecords';

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

export default function ({withdrawals}: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const withdrawalsElement = (
    <ul>
      {(withdrawals || []).map((withdrawal, index) => {
        return <Line key={index} withdrawal={withdrawal} />;
      })}
    </ul>
  );
  return (
    <Wrapper>
      {(withdrawals || []).length > 0 ? (
        withdrawalsElement
      ) : (
          <div>
            <Empty text={t('No withdrawal record')} />
          </div>
        )}
    </Wrapper>
  );
}
