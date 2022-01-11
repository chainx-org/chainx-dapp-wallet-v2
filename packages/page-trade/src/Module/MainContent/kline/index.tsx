// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React, {useEffect} from 'react';
import Wrapper from './Wrapper';
import axios from 'axios';
import {init, dispose} from 'klinecharts';
import styled from 'styled-components';
import {toPrecision} from '../../../components/toPrecision';
import {useApi} from '@polkadot/react-hooks';

const KlineWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 0;
    justify-content: space-around;
    .k-line-chart-container {
      .k-line-chart-title {
        line-height: 60px;
        font-size: 24px;
        font-weight: bold;
        color: #333333;
      }
      .k-line-chart {
        width: 648px;
        height: 302px;
        background-color: #25272F;
        border-radius: 2px;
      }
      .k-line-chart-setting-container {
        margin-top: 0;
        .k-line-chart-setting-button {
          line-height: 22px;
          height: 22px;
          border: none;
          outline: none;
          font-size: 14px;
          color: #333333;
          margin-right: 20px;
          background-color: transparent;
          border-radius: 2px;
          cursor: pointer;
          &:hover {
            background-color: #e1eff9;
          }
        }
        .k-line-chart-setting-button-selected {
          background-color: #e1eff9;
        }
      }
    }
`;

export default function () {
  const api = useApi();

  const dataList: any[] = [];
  useEffect(() => {
    async function fetchKline() {
      const testOrMain = await api.api.rpc.system.properties();
      const testOrMainNum = JSON.parse(testOrMain);
      let res;
      if (testOrMainNum.ss58Format === 42) {
        res = await axios.get('https://api-v2-pre.chainx.org/dex/kline/0/86400000');
        dataList.push(...res.data.items)
      } else {
        res = await axios.get('https://api-v2.chainx.org/dex/kline/0/86400000');
        dataList.push(...res.data.items)
      }

      dataList.reverse().map(data => {
        data.timestamp = data.time
        data.open = toPrecision(data.open,7)
        data.high = toPrecision(data.high,7)
        data.close = toPrecision(data.close,7)
        data.low = toPrecision(data.low,7)
        data.volume = toPrecision(data.volume,7)
      })

      const kLineChart = init('basic-k-line');
      kLineChart.applyNewData(dataList);
      kLineChart.setZoomEnabled(false);
      kLineChart.setPrecision(7, 7)
      kLineChart.setStyleOptions({
        floatLayer: {
          prompt: {
            candleStick: {
              labels: ['时间', '开', '收', '高', '低']
            }
          }
        },
        yAxis: {
          tickText: {
            paddingRight: 8
          }
        }
      });
      kLineChart.setTechnicalIndicatorPrecision(7, 'yAxis')
      kLineChart.setScrollEnabled(false);
    }

    fetchKline();
    return () => {
      dispose('basic-k-line');
    };
  }, []);

  return (
    <Wrapper>
      <KlineWrapper>
        <div className="k-line-chart-container">
          <div id="basic-k-line" className="k-line-chart"/>
        </div>
      </KlineWrapper>

    </Wrapper>
  );
}
