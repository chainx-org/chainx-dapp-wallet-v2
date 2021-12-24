import React from 'react';
import styled from 'styled-components';
import { useLoadingDelay } from '@polkadot/react-hooks';
import Detail from './Detail';
import { useTranslation } from '../translate';

const ChainStatus = styled.div`
  padding: 16px;
  border: 1px solid #DCE0E2;
  margin-left: 16px;
  border-radius: 10px;
  background: rgba(255, 255, 255);
  font-size: 16px;
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.72);
  > .total{
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    opacity: 0.32;
    margin-bottom: 8px;
  }
  > .details{
    > div {
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      >.key{
        display: flex;
        align-items: center;
        > span:first-child{
            display: inline-block;
            border-radius: 50%;
            width: 12px;
            height: 12px;
            margin-right: 12px;
        }
        > .yellowCircle{
          background: rgba(246, 201, 74);
        }
        > .greyCircle{
          background: rgba(194, 194, 194);
        }
        > .blueCircle{
          background: rgba(70, 174, 226);
        }
        > .orangeCircle{
          background: rgba(247, 147, 27);
        }
        > span:last-child{
            color: rgba(0, 0, 0, 0.32);
            font-size: 12px;
        }
      }
      > .data{
          color: rgba(0, 0, 0, 0.32);
          font-size: 12px;
      }
    }
  }
`;
const ProgressBar = styled.div`
  width: 300px;
  height: 10px;
  border-radius: 6px;
  overflow: hidden;
  background: rgba(232, 233, 234);
  margin-bottom: 32px;
  > .line{
    width: 300px;
    height: 10px;
    border-radius: 6px;
    background: rgba(246, 201, 74);
    transform: translateX(-65%);
  }
`;

export default function (): React.ReactElement {
  const { t } = useTranslation();
  const isLoading = useLoadingDelay();
  const detailList = [
    {
      color: 'yellow',
      type: 'KSX',
      data: '57.6%'
    },
    {
      color: 'blue',
      type: 'TR',
      data: '21.3%'
    },
    {
      color: 'grey',
      type: 'PolkaX',
      data: '20.0%'
    },
    {
      color: 'orange',
      type: 'sBTC',
      data: '1.1%'
    }
  ];

  return (
    <ChainStatus>
      <p>{t('Chain status')}</p>
      <div className='total'>
        <span>{t('Total Issuance')}（KSX）</span>
        <span>7,311,000/21,000,000</span>
      </div>
      <ProgressBar>
        <div className='line'>
        </div>
      </ProgressBar>
      <div className='details'>
        {
          isLoading ? undefined : detailList.map(({ color, data, type }) =>
            (
              <Detail color={color}
                data={data}
                type={type} />
            ))
        }
      </div>
    </ChainStatus>
  );
}
